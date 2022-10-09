// 评论类相关接口处理，如创建评论、删除评论、分页获取评论列表等
// 接口前缀均为/api/comments，由router.js添加到路由中

const Blog = require('../models/blog');
const Comment = require('../models/comment');
const { APIError, parsePage, checkAdmin, generateId } = require('../util');

const commentApis = [{
  url: '/api/comments', // 分页获取评论列表，，/api/comments?page=2&size=10
  method: 'GET',
  fn: async ctx => {
    let page = parsePage(ctx.query);

    let rs = await Comment.findAndCountAll({
      limit: page.pageSize,
      offset: page.pageSize * (page.currentPage - 1),
      order: [
        ['createTime', 'DESC']
      ]
    });

    let comments = rs.rows;
    page.fulfillByTotalCount(rs.count);

    ctx.body = { comments, page };
  }
}, {
  url: '/api/comments/create', // 创建评论
  method: 'POST',
  fn: async ctx => {
    let user = ctx.state.user

    // 只有登录用户可以创建评论
    if (!user) {
      throw new APIError('permission:no_permission', 'only login users have permission');
    }

    let blogId = ctx.request.body.blogId;
    let content = ctx.request.body.content;

    if (!content || !content.trim()) {
      throw new APIError('param:invalid_value', 'invalid content');
    }

    let blog = await Blog.findOne({
      where: {
        id: blogId
      }
    });
    if (!blog) {
      throw new APIError('param:invalid_value', `blog with id '${blogId}' dosen't exist`);
    }

    ctx.body = await Comment.create({
      id: generateId(),
      blogId: blogId,
      userId: user.id,
      userName: user.name,
      userImage: user.image,
      content: content.trim()
    });
  }
}, {
  url: '/api/comments/:id/delete', // 删除评论
  method: 'GET',
  fn: async ctx => {
    let user = ctx.state.user;
    let { id } = ctx.params;

    // 检查权限，只有管理员能删除评论
    checkAdmin(user);

    let rs = await Comment.destroy({
      where: {
        id: id
      }
    });

    if (rs === 0) {
      throw new APIError('operation:delete_failed', `fail to delete the comment with id '${id}', maybe the id is not correct`);
    }

    ctx.body = { rows: rs };
  }
}];

module.exports = commentApis;