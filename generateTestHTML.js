const fs = require("fs");

const {FONT_NAME} = process.env

const result = fs.readdirSync("build/colorGlyphs");

let html = "";

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

    [data-icon]:before  {
      font-family: "${FONT_NAME}";
      content: '\\f101';
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
  </style>
</body>
</html>`);
