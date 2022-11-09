# 编译步骤

## 前置条件

安装apt依赖： `sudo apt install fonttools fontforge`

> python3 依赖自行处理。`python3-fontforge` 可不安装，使用了 `fontforge -lang=py -script` 替代。

安装npm依赖： `yarn install`

编译生成 stat-icons.ttf 文件： `make`，位于 `build/star-icons.ttf`。

编译测试网页： `make test`

## Makefile 分析

1. make build/codepoints.js 或 make build/Twemoji\ Mozilla.ttx
  
实际工作: node layerize.js twe-svg.zip overrides extras build Twemoji\ Mozilla

2. make build/raw-font/Twemoji\ Mozilla.ttf

实际工作: **npm run grunt webfont**

3. make build/Twemoji\ Mozilla.ttf

实际工作: 
- rm -f build/Twemoji\ Mozilla.ttf
- ttx -t name -o build/raw-font/Twemoji\ Mozilla.ttf.names build/raw-font/Twemoji\ Mozilla.ttf
- perl -i -e 'my $ps = 0;' \
    -e 'while(<>) {' \
    -e '  $ps = 1 if m/nameID="6"/;' \
    -e '  $ps = 0 if m|</namerecord>|;' \
    -e '  s/Twemoji Mozilla/TwemojiMozilla/ if $ps;' \
    -e '  print;' \
    -e '}' build/raw-font/Twemoji\ Mozilla.ttf.names
- ttx -m build/raw-font/Twemoji\ Mozilla.ttf -o build/raw-font/Twemoji\ Mozilla.temporary.ttf build/raw-font/Twemoji\ Mozilla.ttf.names
- /usr/bin/fontforge -lang=py -script fixDirection.py build/raw-font/Twemoji\ Mozilla.temporary.ttf
- ttx -m build/raw-font/Twemoji\ Mozilla.temporary.ttf -o build/Twemoji\ Mozilla.ttf build/Twemoji\ Mozilla.ttx

## 兼容原 gaia-icons 的修改具体步骤

### 步骤1, 生成码点codepoints和ttx xml文件

node layerize.js twe-svg.zip overrides extras build Twemoji\ Mozilla

我们使用 ttx 工具对原 gaia-icons 进行处理, 得到 gaia-icons.ttx xml 文档

比对原 gaia-icons.ttx，梳通 layerize.js 中的流程，做到兼容效果。

### 步骤2, 生成原生字体(raw fonts)

使用 grunt-webfonts 工具，在 Gruntfile.js 中添加指定配置，默认生成。

在单步执行时会报大量异常，但不影响最终生成物。

**该过程无需干预。**

### 步骤3, 处理ttf和ttx生成最终字体

1. ttx -t name -o x.names x.ttf, 首先生成字体的 names
2. ttx -m x.ttf -o x.temporary.ttf x.names, 再将　names 和字体混合，生成临时字体
3. ttx -m x.temporary.ttf -o x.ttf x.ttx, 最后将临时字体和步骤1中生成的ttx混合, 生成最终字体

**该过程无需干预。**

## 如何修改

往 star-icons.zip 中添加英文字符串命名的图标。

注意字符串的格式，如果图标有前缀，则不能使用已存在的前缀。

如：如果存在 add.svg，则添加 add-contact.svg 时，会显示成 add.svg 的内容。

推荐格式：

- 系列图标: battery-0.svg, battery-1.svg, ...
- 动作图标：edit-contact.svg, edit-image.svg, edit-left.svg, ...