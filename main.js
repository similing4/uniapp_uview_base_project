import Vue from 'vue'
import App from './App'
import uView from 'uview-ui';
import httpApi from '@/common/http.api.js';
import store from '@/store';

Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(uView);
Vue.use(httpApi);


Object.values = (obj) => {
	let arr = [];
	for (let i in obj)
		arr.push(obj[i]);
	return arr;
}
Object.keys = (obj) => {
	let arr = [];
	for (let i in obj)
		arr.push(i);
	return arr;
}
Vue.prototype.alert = (msg) => {
	return new Promise((recv, recj) => {
		uni.showModal({
			title: '提示',
			content: msg,
			success(res) {
				if (res.confirm) {
					return recv();
				} else if (res.cancel) {
					return recj();
				}
			}
		});
	});
}
Vue.prototype.$u.vuex = (name, value) => {
	Vue.prototype.$store.commit('$uStore', {
		name,
		value
	})
};

const app = new Vue({
	store,
	...App
})
app.$mount()