// 文章类相关接口处理，如创建文章、删除文章、分页获取文章列表等
// 接口前缀均为/api/blogs，由router.js添加到路由中

const Blog = require('../models/blog');
const Comment = require('../models/comment');
const { sequelize } = require('../database');
const { parsePage, APIError, transformText, checkAdmin, generateId } = require('../util');

const blogApis = [{
  url: '/api/blogs', // 分页获取文章列表，/api/blogs?page=2&size=10
  method: 'GET',
  fn: async ctx => {
    let page = parsePage(ctx.query);

    let rs = await Blog.findAndCountAll({
      limit: page.pageSize,
      offset: page.pageSize * (page.currentPage - 1),
      order: [
        ['createTime', 'DESC']
      ]
    });

    let blogs = rs.rows;
    page.fulfillByTotalCount(rs.count);

    ctx.body = { blogs, page };
  }
}, {
  url: '/api/blogs/:id', // 获取指定id的文章
  method: 'GET',
  fn: async ctx => {
    let { id } = ctx.params;

    let blog = await Blog.findOne({
      where: {
        id: id
      }
    });

    if (!blog) {
      throw new APIError('value:not_found', `cannot find a blog with id '${id}'`);
    }

    let comments = await Comment.findAll({
      where: {
        blogId: id
      },
      order: [
        ['createTime',  'DESC']
      ]
    })
    for (const comment of comments) {
      comment.html = transformText(comment.content);
    }

    blog.html = transformText(blog.content);
    blog.comments = comments;
    ctx.body = blog
  }
}, {
  url: '/api/blogs/create', // 创建文章
  method: 'POST',
  fn: async ctx => {
    let user = ctx.state.user;

    // 检查权限，只有管理员能创建文章
    checkAdmin(user);

    let { name, summary, content } = ctx.request.body;

    if (!name || !name.trim()) {
      throw new APIError('param:invalid_value', 'invalid name');
    }
    if (!summary || !summary.trim()) {
      throw new APIError('param:invalid_value', 'invalid summary');
    }
    if (!content || !content.trim()) {
      throw new APIError('param:invalid_value', 'invalid content');
    }

    ctx.body =  await Blog.create({
      id: generateId(),
      userId: user.id,
      userName: user.name,
      userImage: user.image,
      name: name.trim(),
      summary: summary.trim(),
      content: content.trim(),
      createTime: Date.now() / 1000, // 数据库初建时存的时间是秒数而非毫秒数，为兼容老的数据需进行此处理
      html: transformText(content.trim())
    });
  }
}, {
  url: '/api/blogs/:id/update', // 更新文章
  method: 'POST',
  fn: async ctx => {
    let user = ctx.state.user;
    let { id } = ctx.params;

    // 检查权限，只有管理员能更新文章
    checkAdmin(user);

    let { name, summary, content } = ctx.request.body;

    if (!name || !name.trim()) {
      throw new APIError('param:invalid_value', 'invalid name');
    }
    if (!summary || !summary.trim()) {
      throw new APIError('param:invalid_value', 'invalid summary');
    }
    if (!content || !content.trim()) {
      throw new APIError('param:invalid_value', 'invalid content');
    }

    // 注意：若更新后的数据同更新前的数据相比没有变化，update方法返回的受影响的数据行数也是0
    await Blog.update({
      name: name.trim(),
      summary: summary.trim(),
      content: content.trim(),
      html: transformText(content.trim())
    }, {
      where: {
        id: id
      }
    });
    let blog = await Blog.findOne({
      where: {
        id: id
      }
    });
    if (!blog) {
      throw new APIError('operation:update_failed', `fail to update the blog with id '${id}', maybe the id is not correct`);
    }
    ctx.body = blog;
  }
}, {
  url: '/api/blogs/:id/delete', // 删除文章
  method: 'GET',
  fn: async ctx => {
    let user = ctx.state.user;
    let { id } = ctx.params;

    // 检查权限，只有管理员能删除文章
    checkAdmin(user)

    // 使用事务，删除文章及文章的评论
    let rs = await sequelize.transaction(async t => {
      let rows = await Blog.destroy({
        where: {
          id: id
        }
      });
      await Comment.destroy({
        where: {
          blogId: id
        }
      });
      return rows;
    });

    if (rs === 0) {
      throw new APIError('operation:delete_failed', `fail to delete the blog with id '${id}', maybe the id is not correct`);
    }

    ctx.body = { rows: rs };
  }
}];

module.exports = blogApis;