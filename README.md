# common-frontend（v-1.0）

> vue part

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

```


## 项目结构
#### 主要代码均在src目录下完成
- src
  - assets              
  - commpents                         - - - - - - - - - - - - -组件
     - bg_img                             - - - - - - - - - - - - -首页走马灯图片
     - common                           - - - - - - - - - - - - -公共布局组件
         - HeaderBar                    
         - LogInAndSignUp    
         - SideBar             
     - nav                                   - - - - - - - - - - - - -新增组件
     - Home.vue                 
  - router                                  - - - - - - - - - - - - -路由配置
  - util                                      - - - - - - - - - - - - -通用方法
  - vuex
  - APP.vue
  - main.js   


## 快速搭建

1.克隆项目到本地

2.在nav目录下新增组件（组件中布局的template以及js根据实际需求来写，使用element UI 组件更快完成布局 ）

3.在router.js中import此组件，并配置路由即可

> 提示：
> 1. 前端部分本地调试端口由config路径下index.js中port配置；配合后台服务调试地址由main.js中baseURL配置 
> 3. 仅供此布局后台系统的快速开发，更多通用组件待完善