import Vue from 'vue'
import filters from '@/utils/filters'

// utilsに定義したfilter関数をVueインスタンスのfilterへ登録
Object.keys(filters).forEach((key: string) => {
  Vue.filter(key, filters[key])
})

// utilsにfilterの実処理を分離することで、
// productionコードとテストコードから容易に
// 呼び出すことが可能になる
