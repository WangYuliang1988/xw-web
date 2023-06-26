/**
 * Vite 在一个特殊的 import.meta.env 对象上暴露环境变量，并内建了常用的环境变量，如 import.meta.env.DEV 等。
 *
 * Vite 支持使用 .env 文件加载额外的环境变量，额外加载的环境变量同样通过 import.meta.env 暴露，且必须以 VITE_ 为前缀。
 *
 * 为支持 TypeScrit 的类型检查和智能提示，Vite 在 vite/client.d.ts 中为 import.meta.env 及具体的内建环境变量提供了对应的类型定义。
 *
 * 如果要使用 vite/client.d.ts 以支持 TypeScrit 对 import.meta.env 的类型检查和智能提示，需要创建一个 .d.ts 文件，并通过三斜杠指令引入 vite/client.d.ts 文件。
 *
 * 备注：
 *   1、创建的 .d.ts 文件名称没有限制，如 vite-env.d.ts 文件，但需确保 tsconfig.json 的 include 规则中包含该文件。
 *   2、vite/client.d.ts 中不止包含环境变量类型定义，还包括如图片等文件类型声明，以支持 import 相关文件时的类型检查。
 */
/// <reference types="vite/client" />

/**
 * 如果要为 .env 文件中自定义的环境变量添加 TypeScript 支持，则除了按如上所示引入 vite/client.d.ts 外，还需取消对下方代码的注释并添加具体变量的类型声明。
 * 
interface ImportMetaEnv {
  readonly VITE_SOME_VAR: number
  ...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
 */
