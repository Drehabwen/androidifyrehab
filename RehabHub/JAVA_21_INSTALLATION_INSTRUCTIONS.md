# Java 21 安装指南

## 问题说明

您的项目构建失败是因为 Java 版本不兼容：
- 您的项目使用的是 Gradle 8.11.1，它需要 Java 21
- 您系统上安装的 Java 版本是 17.0.12

## 解决方案：安装 Adoptium OpenJDK 21

### 步骤 1: 下载 OpenJDK 21

1. 访问 Adoptium 官网: https://adoptium.net
2. 选择版本: Java 21 (LTS)
3. 选择操作系统: Windows
4. 选择架构: x64
5. 选择包类型: MSI Installer
6. 点击下载按钮

或者直接访问这个链接下载最新版本:
https://github.com/adoptium/temurin21-binaries/releases/latest/download/OpenJDK21U-jdk_x64_windows_hotspot.msi

### 步骤 2: 安装 OpenJDK 21

1. 双击下载的 MSI 文件
2. 按照安装向导完成安装
3. 默认安装路径通常是: `C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot`

### 步骤 3: 配置环境变量

#### 设置 JAVA_HOME 环境变量:

1. 右键点击"此电脑"或"我的电脑"
2. 选择"属性"
3. 点击"高级系统设置"
4. 点击"环境变量"
5. 在"系统变量"部分点击"新建"
6. 变量名输入: `JAVA_HOME`
7. 变量值输入: `C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot` (根据实际安装路径调整)
8. 点击"确定"

#### 更新 PATH 环境变量:

1. 在环境变量窗口中，找到"系统变量"中的`Path`变量
2. 选中它并点击"编辑"
3. 点击"新建"
4. 输入: `%JAVA_HOME%\bin`
5. 点击"确定"保存所有更改

### 步骤 4: 验证安装

1. 打开新的命令提示符窗口
2. 输入以下命令验证 Java 版本:
   ```
   java -version
   ```
3. 应该显示类似以下输出:
   ```
   openjdk version "21.x.x" 2024-xx-xx
   OpenJDK Runtime Environment (build 21.x.x+xx)
   OpenJDK 64-Bit Server VM (build 21.x.x+xx, mixed mode, sharing)
   ```

### 步骤 5: 重新构建项目

完成以上步骤后，返回到您的项目目录并重新运行构建命令:
```
cd android
.\gradlew.bat assembleDebug
```

## 替代方案

如果您暂时无法安装 Java 21，可以考虑:

1. 修改项目配置以使用 Java 17（需要修改 Gradle 版本和相关配置）
2. 使用 Android Studio 内置的 JDK（如果版本兼容）

请注意，使用较低版本的 Java 可能会导致项目功能不完整或出现兼容性问题。