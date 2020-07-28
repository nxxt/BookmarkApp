import { Context } from '@nuxt/types'

export default function({ $auth, route, redirect }: Context) {
  // index=>bookmarks/h-0
  if (
    $auth.user &&
    (route.path === '/' ||
      route.path === '/bookmarks' ||
      route.path === '/bookmarks/')
  ) {
    redirect('/bookmarks/h-0')
  }
}
