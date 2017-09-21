### 项目地址

[https://github.com/spdy-nerv/proj-edu](https://github.com/spdy-nerv/proj-edu)

### 目录结构

	proj-edu
		  |-- README.md                 // 本说明文档
		  |-- package.json              // 项目依赖的npm包配置，主要用于gulp构建
		  |-- gulpfile.js               // 项目构建脚本
		  |-- node_modules              // npm包安装目录
		  |-- base                      // 基础版本源代码目录，子目录遵循小程序目录规范 
		  |-- cases                     // 各高校的项目代码，只创建或同步自base的源代码
		         |-- fe-tinyapp-fudan
		         |-- fe-tinyapp-zheda
		         |-- ...

### 约定优于配置
鉴于本项目的特点为一个基础版本需要复制出多个高校的版本，既要保证各版本公共模块的功能一致性，又要保证各高校个性化风格的诉求。为了尽可能方便配置管理，抽取出动态配置项，现做代码级别的约定如下：

1. 与ui风格相关的视觉素材统一放在`themes`文件夹，创建项目实例时会在该目录下自动生成一个对应实例元素的js配置文件，文件名可在创建项目时自定义；
2. 全局的关键配置项统一放在`config.js`，主要包括caseName（项目实例名称）、themeName（实例素材文件的名称）、domainPrefix（实例调用接口的域名）、syncGlob（接受基础代码同步的目录和文件列表）；
3. 强烈建议不要轻易改动任何与config配置相关的代码，代码在`app.js`和`const.js`中；
4. 对于业务代码的修改，请尽优先修改`base`中的基础版本代码，然后通过后续说明的方式，把代码同步到各个项目实例。

### 克隆代码到本地
1. 拉取项目代码至本地

		git clone xxx
		
2. 安装npm依赖包

		// 后续构建脚本基于gulp，如果全局环境下没有安装gulp客户端，请先
		npm install -g gulp-cli

		// 然后
		cd path/to/proj-edu
		npm install


### 创建项目实例

1. 在项目根目录下执行：

		gulp new
		
2. 根据提示输入全局配置信息：

	![image](http://fudan-1253427581.cossh.myqcloud.com/edu-guide.png?sign=IJkVYNw0KyTTkoGGMtjnWF8QA+BhPTEyNTM0Mjc1ODEmaz1BS0lER1FQRHJLcmRhUDRZczFxbE9yOEVEMWVBVmdnV2NnMUMmZT0xNTA4NTkyMjU2JnQ9MTUwNjAwMDI1NiZyPTE3MzM4Mzk5ODMmZj0vZWR1LWd1aWRlLnBuZyZiPWZ1ZGFu =700x)

3. 最终会在`cases`文件夹中生成`fe-tinyapp-fudan`的项目实例代码，代码由当前最新版本的base源码拉取。同时在`themes`文件夹中自动生成`fudan.js`素材配置文件，`config.js`文件中的配置项也已更新为手动输入的信息。



### 同步代码

1. 在项目根目录下执行如下代码，可把基础版本的最新代码同步到每一个项目实例：

		gulp sync
		
2. 如果某个项目实例的部分文件不希望获得基本代码的覆盖同步，可以在`config.js`中的`syncGlob`进行覆盖文件排除配置。默认的配置如下：

		syncGlob: ['base/**/*', '!base/config.js', '!base/resources/*']
		
		// 表示除了config.js和resources文件夹之外，其他文件都做覆盖同步。
		
3. [什么是glob？](https://github.com/isaacs/node-glob)

### 更多注意事项
1. 本简易的项目前端工程化流程目的只有两个：（1）简化从基础版本拉取项目实例的流程；（2）提升从基础版本同步最新代码到各个项目实例的自动化效率。
2. 本流程并不能解决所有的工程化问题。比如，某个高校的首页有高度个性化的需求，与基础版本差异很大，那么建议在`config.js`中配置`syncGlob`来排除接受`pages/entry/**/*`的覆盖同步，然后手工维护项目实例中的对应代码。