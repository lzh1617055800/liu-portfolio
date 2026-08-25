# 刘倬滈 / Engineering Portfolio

这是可直接交给 HR 的静态作品集，内容围绕 C++、Qt、Linux、汽车软件、桌面工具和系统工程展开。

## 本地预览

在 `liu-portfolio` 目录的上一级运行：

```powershell
python -m http.server 4173 --directory liu-portfolio
```

打开 <http://127.0.0.1:4173/>。不要直接双击 `index.html`，否则浏览器会以 `file://` 打开，部分资源和分享预览行为无法按线上环境验证。

## 推荐上线方式：GitHub Pages

1. 在 GitHub 账号 `lzh1617055800` 下新建一个公开仓库，建议仓库名为 `liu-portfolio`。
2. 将本目录中的**全部文件和隐藏文件**上传到仓库根目录，尤其不要漏掉 `.github/workflows/pages.yml`。
3. 推送到 `main` 分支后，Actions 会自动部署。
4. 在仓库的 `Settings → Pages` 中确认 Source 使用 `GitHub Actions`。
5. 默认地址预计为：`https://lzh1617055800.github.io/liu-portfolio/`。GitHub 部署完成后，以 Actions 输出的真实地址为准。

如果使用自定义域名，请在仓库的 Pages 设置中绑定域名，并同步修改 `robots.txt` 与 `sitemap.xml` 里的地址。HTTPS 由 GitHub Pages 自动提供。

## 其他上线方式

- Netlify：将 `liu-portfolio` 文件夹拖入 Deploy 页面即可获得 HTTPS 地址。
- Cloudflare Pages：连接 GitHub 仓库，Framework 选择 `None`，构建命令留空，输出目录填 `/`。
- 自有服务器：将目录内容放到 Nginx 的静态站点目录，开启 HTTPS，并将域名 A/AAAA 记录指向服务器。

## 交给 HR 的正式入口

上线后建议只发一个短链接，不要发本地路径：

> 刘倬滈个人作品集：`https://你的域名/`

简历中的链接建议使用完整 HTTPS 地址，邮件签名可以附上同一地址。页面已经准备好：

- 简历 PDF 下载入口
- GitHub 入口
- 移动端布局
- 页面标题、描述、Open Graph 分享信息
- Person 结构化数据
- `robots.txt` 与 `sitemap.xml`
- 404 页面
- GitHub Pages 自动部署 workflow

目前唯一无法在本地替你完成的是：使用你的 GitHub/域名账号执行公开发布。这样可以避免在没有授权的情况下创建仓库、绑定域名或公开你的个人资料。
