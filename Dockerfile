# 使用官方的 Node.js 镜像作为基础镜像，这里指定了版本为 21
FROM node:21 AS builder

# 设置工作目录 
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm i tyarn -g
RUN tyarn install

# 将项目中的所有文件复制到工作目录
COPY . .

# 构建项目
RUN npm run build

# 使用一个轻量级的静态文件服务器作为基础镜像，这里使用 nginx:alpine 版本
FROM nginx:alpine

# 将构建后的文件复制到 Nginx 的默认站点目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 可选：如果你需要自定义 Nginx 配置，可以复制一个 nginx.conf 文件
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口供外部访问
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]