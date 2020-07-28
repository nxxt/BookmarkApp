import Vue from 'vue'
import getters from '@/utils/getters'

// utilsに定義したget系関数をVueインスタンスへpluginとして登録
Object.keys(getters).forEach((key: string) => {
  Vue.prototype[key] = getters[key]
})

// utilsにget系の実処理を分離することで、
// productionコードとテストコードから容易に
// 呼び出すことが可能になる
