const fs = require("fs");

const {FONT_NAME} = process.env

const result = fs.readdirSync("build/colorGlyphs");

let html = "";

fs.writeFileSync('build/result', JSON.stringify(result))

for (const item of result) {
  html += `<a data-icon="${item.slice(0, -4)}"></a>`;
}

fs.writeFileSync("test_star_icons.html", `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试文件</title>
</head>
<body>
  ${html}

  <style>
    @font-face {
      font-family: "${FONT_NAME}";
      src: url("build/${FONT_NAME}.ttf") format("truetype");
      font-weight: 500;
      font-style: normal;
    }

    a {
      box-sizing: content-box;
      display: inline-block;
      width: 2rem;
      height: 2rem;
      text-decoration: none;
      border: solid 1px #eee;
      text-align: center;
      margin: -1px;
      line-height: 1;
      color: rgba(77, 77, 77, 1); /* 线性图标/常规黑 */
      background: linear-gradient(134.78deg, #F7F5F7 2.34%, #FAFAFA 34.11%, #E1E4F2 100%);
    }

    [data-icon]:before  {
      font-family: "${FONT_NAME}";
      content: attr(data-icon);
      display: inline-block;
      font-weight: 500;
      font-style: normal;
      text-decoration: inherit;
      text-transform: none;
      text-rendering: optimizeLegibility;
      font-size: 30px;
      -webkit-font-smoothing: antialiased;
    }

    @media (prefers-color-scheme: dark) {
      a {
        color: rgba(244, 244, 244, 1); /* 常规白 */
        background: linear-gradient(101.98deg, #4E5161 1.12%, #363A47 96.75%);
      }
    }
  </style>
</body>
</html>`);
