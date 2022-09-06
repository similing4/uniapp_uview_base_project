import serverURL from "./host.js";

class DataModel {
	_method = "POST";
	_param = {};
	_url = null;

	constructor(url) {
		this._url = url;
	}

	param(param) {
		Object.assign(this._param, param);
		return this;
	}

	method(method) {
		this._method = method.toUpperCase();
		return this;
	}

	_getUrlParam() {
		const itemArr = Object.keys(this._param).map((key) => {
			return key + "=" + this._param[key];
		});
		return itemArr.join("&");
	}

	checkAuthorization() {
		return !!uni.getStorageSync("AuthToken");
	}

	async call() {
		let header = {
			'content-type': 'application/x-www-form-urlencoded'
		};
		if (this.checkAuthorization())
			header.Authorization = "Bearer " + uni.getStorageSync("AuthToken");
		let res = await new Promise((recv, recj) => {
			uni.request({
				method: this._method,
				url: this._url,
				data: this._param,
				header,
				success: (e1) => {
					if (e1.statusCode != 200)
						return recj(new Error("请求接口时服务器响应错误码：" + e1.statusCode));
					recv(e1);
				},
				fail(err) {
					recj(new Error(err));
				}
			})
		});
		return res.data;
	}
	async upload(key, file) {
		let header = {
			'content-type': 'application/x-www-form-urlencoded'
		};
		if (this.checkAuthorization())
			header.Authorization = uni.getStorageSync("AuthToken");
		let res = await new Promise((recv, recj) => {
			uni.uploadFile({
				url: this._url,
				formData: this._param,
				header,
				name: key,
				filePath: file,
				success: (e1) => {
					recv(e1);
				},
				fail(err) {
					recj(err);
				}
			})
		});
		return JSON.parse(res.data);
	}
}

const install = (Vue) => {
	Vue.prototype.$api = (url) => {
		return new DataModel(serverURL + url);
	};
	Vue.prototype.$api.setLoginToken = (token) => {
		uni.setStorageSync("AuthToken", token);
	};
	Vue.prototype.$api.removeLoginToken = () => {
		uni.removeStorageSync("AuthToken");
	};
};
export default {
	install
};
