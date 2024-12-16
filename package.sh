#!/bin/bash

# 创建临时目录
temp_dir="temp_package"
mkdir -p $temp_dir

# 复制必要文件
cp -r \
  manifest.json \
  background.js \
  bookmark.html \
  bookmark.js \
  options.html \
  options.js \
  privacy-policy.md \
  README.md \
  css \
  images \
  $temp_dir/

# 创建 zip 包
zip -r extension.zip $temp_dir/*

# 清理临时目录
rm -rf $temp_dir

echo "打包完成！生成的文件："
echo "- extension.zip (源代码包)"
