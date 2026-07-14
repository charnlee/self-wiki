# Self Wiki

Self Wiki 是一个基于 Wiki.js 二次维护的个人知识库项目，用于部署自己的文档、笔记和内部资料管理服务。

## 项目说明

本项目从 Wiki.js 源码改造而来，后续会根据个人使用场景持续调整功能、部署方式和界面体验。

当前仓库已经内置 Docker 部署配置，可以在服务器上一键启动：

- Wiki.js 应用服务
- PostgreSQL 数据库
- Caddy 反向代理

## 本地开发

项目要求 Node.js 20 或更高版本。

```bash
nvm use
yarn install
cp config.sample.yml config.yml
yarn dev
```

默认访问地址：

```text
http://localhost:3000
```

本地开发需要准备 PostgreSQL，并在 `config.yml` 中配置数据库连接。

## Docker 部署

服务器部署推荐使用 `deploy/` 目录中的 Compose 配置。

```bash
cd deploy
cp .env.example .env
vim .env
docker compose up -d --build
```

`.env` 中至少需要修改：

```env
SITE_HOST=wiki.example.com
POSTGRES_PASSWORD=change-this-password
```

如果只是用服务器 IP 测试，可以先使用：

```env
SITE_HOST=:80
```

查看服务状态：

```bash
docker compose ps
docker compose logs -f wiki
docker compose logs -f caddy
```

## 目录说明

```text
client/    前端源码
server/    后端源码
dev/       构建、开发和示例配置
deploy/    自定义 Docker 部署配置
```

## 同步上游

当前仓库保留了 Wiki.js 官方仓库作为 `upstream`，用于后续按需同步官方更新。

```bash
git fetch upstream
git merge upstream/main
```

同步前建议先确认本地改动已经提交，并根据实际冲突谨慎处理。

## 许可证

本项目基于 Wiki.js，遵循原项目的 AGPL-3.0 许可证。详细内容见 [LICENSE](./LICENSE)。

上游项目：

```text
https://github.com/requarks/wiki
```
