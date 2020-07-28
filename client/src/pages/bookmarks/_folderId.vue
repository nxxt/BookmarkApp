<template>
  <v-container fluid class="darkest d-flex align-start pa-0 ma-0 fill-height">
    <x-mobile-view
      v-if="isMobile"
      ref="mobile"
      :filter.sync="filter"
      :display-type.sync="displayType"
      @plus-btn-click="toggleEditContent(1)"
      @arrow-left-btn-click="toggleEditContent(2)"
    >
      <template v-slot:sidebar>
        <x-sidebar-menu
          color="darkest"
          :headers="headers"
          :folders="folders"
          :maintenances="maintenances"
          @sidebar-menu-click="onSidebarMenuClick"
          @create-folder-btn-click="onCreateFolderBtnClick"
          @bookmark-drop="onBookmarkDrop"
          @folder-edit-btn-click="onFolderEditBtnClick"
          @folder-delete-btn-click="onFolderDeleteBtnClick"
        />
      </template>

      <template v-slot:list>
        <x-list-group
          v-show="displayType.id === 0"
          ref="m-list-group"
          :items="displayBookmarks"
          :list-name="listName"
          :list-number="listTotalNumber"
          :selection.sync="selection"
          :show-loading="showLoading"
          color="darker"
          @sort-change="onSortChange"
          @download-btn-click="onDownloadBtnClick"
          @bookmark-title-click="onBookmarkTitleClick"
          @hash-tag-click="onHashTagClick"
          @folder-text-click="onFolderTextClick"
          @browser-open-btn-click="onBrowserOpenBtnClick"
          @bookmark-edit-btn-click="onBookmarkEditBtnClick"
          @bookmark-remove-btn-click="onBookmarkRemoveBtnClick"
          @list-area-scroll="onListAreaScroll"
        />
        <x-card-group
          v-show="displayType.id === 1"
          ref="m-card-group"
          :items="displayBookmarks"
          :list-name="listName"
          :list-number="listTotalNumber"
          :selection.sync="selection"
          :show-loading="showLoading"
          is-mobile
          @sort-change="onSortChange"
          @download-btn-click="onDownloadBtnClick"
          @bookmark-title-click="onBookmarkTitleClick"
          @hash-tag-click="onHashTagClick"
          @folder-text-click="onFolderTextClick"
          @browser-open-btn-click="onBrowserOpenBtnClick"
          @bookmark-edit-btn-click="onBookmarkEditBtnClick"
          @bookmark-remove-btn-click="onBookmarkRemoveBtnClick"
          @list-area-scroll="onListAreaScroll"
        />
      </template>

      <template v-slot:edit>
        <x-create-form
          v-if="isBookmarkCreating && !isFolderEditing && !isTagEditing"
          is-mobile
          color="darker"
          @url-save-btn-click="onUrlSaveBtnClick"
        >
          <v-progress-circular
            v-if="isBookmarkCreating && isLoading"
            indeterminate
            color="primary"
          />
        </x-create-form>

        <x-edit-form
          v-if="!isBookmarkCreating && !isFolderEditing && !isTagEditing"
          v-model="editingBookmark"
          is-mobile
          color="darker"
          @bookmark-save-btn-click="onBookmarkSaveBtnClick"
          @duplicate-tag-name="onDuplicateTagName"
        />

        <x-folder-edit-form
          v-if="!isBookmarkCreating && isFolderEditing && !isTagEditing"
          v-model="editingFolder"
          color="darker"
          is-mobile
          @folder-save-btn-click="onFolderSaveBtnClick"
        />

        <x-tag-edit-form
          v-if="!isBookmarkCreating && !isFolderEditing && isTagEditing"
          is-mobile
          color="darker"
          @tag-delete-btn-click="onTagDeleteBtnClick"
        />
      </template>
    </x-mobile-view>

    <x-desktop-view
      v-if="!isMobile"
      ref="desktop"
      :filter.sync="filter"
      :display-type.sync="displayType"
      @plus-btn-click="toggleEditContent(1)"
      @arrow-left-btn-click="toggleEditContent(2)"
    >
      <template v-slot:sidebar>
        <x-sidebar-menu
          color="darkest"
          :headers="headers"
          :folders="folders"
          :maintenances="maintenances"
          @sidebar-menu-click="onSidebarMenuClick"
          @create-folder-btn-click="onCreateFolderBtnClick"
          @bookmark-drop="onBookmarkDrop"
          @folder-edit-btn-click="onFolderEditBtnClick"
          @folder-delete-btn-click="onFolderDeleteBtnClick"
        />
      </template>

      <template v-slot:list>
        <x-list-group
          v-show="displayType.id === 0"
          ref="d-list-group"
          :items="displayBookmarks"
          :list-name="listName"
          :list-number="listTotalNumber"
          :selection.sync="selection"
          :show-loading="showLoading"
          color="darker"
          @sort-change="onSortChange"
          @download-btn-click="onDownloadBtnClick"
          @bookmark-title-click="onBookmarkTitleClick"
          @hash-tag-click="onHashTagClick"
          @folder-text-click="onFolderTextClick"
          @browser-open-btn-click="onBrowserOpenBtnClick"
          @bookmark-edit-btn-click="onBookmarkEditBtnClick"
          @bookmark-remove-btn-click="onBookmarkRemoveBtnClick"
          @list-area-scroll="onListAreaScroll"
        />
        <x-card-group
          v-show="displayType.id === 1"
          ref="d-card-group"
          :items="displayBookmarks"
          :list-name="listName"
          :list-number="listTotalNumber"
          :selection.sync="selection"
          :show-loading="showLoading"
          @sort-change="onSortChange"
          @download-btn-click="onDownloadBtnClick"
          @bookmark-title-click="onBookmarkTitleClick"
          @hash-tag-click="onHashTagClick"
          @folder-text-click="onFolderTextClick"
          @browser-open-btn-click="onBrowserOpenBtnClick"
          @bookmark-edit-btn-click="onBookmarkEditBtnClick"
          @bookmark-remove-btn-click="onBookmarkRemoveBtnClick"
          @list-area-scroll="onListAreaScroll"
        />
      </template>

      <template v-slot:edit>
        <x-create-form
          v-if="isBookmarkCreating && !isFolderEditing && !isTagEditing"
          color="darker"
          @url-save-btn-click="onUrlSaveBtnClick"
        >
          <v-progress-circular
            v-if="isBookmarkCreating && isLoading"
            indeterminate
            color="primary"
          />
        </x-create-form>

        <x-edit-form
          v-if="!isBookmarkCreating && !isFolderEditing && !isTagEditing"
          v-model="editingBookmark"
          color="darker"
          @bookmark-save-btn-click="onBookmarkSaveBtnClick"
          @duplicate-tag-name="onDuplicateTagName"
        />

        <x-folder-edit-form
          v-if="!isBookmarkCreating && isFolderEditing && !isTagEditing"
          v-model="editingFolder"
          color="darker"
          @folder-save-btn-click="onFolderSaveBtnClick"
        />

        <x-tag-edit-form
          v-if="!isBookmarkCreating && !isFolderEditing && isTagEditing"
          color="darker"
          @tag-delete-btn-click="onTagDeleteBtnClick"
        />
      </template>
    </x-desktop-view>

    <v-snackbar v-model="snackbar" color="grey darken-4" :timeout="timeout">
      {{ snackbarText }}
      <v-btn color="primary" small icon text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Watch, Component, Vue } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import IBookmark from '@@/types/IBookmark'
import ITag from '@@/types/ITag'
import IFolder from '@@/types/IFolder'
import ISortType from '@@/types/ISortType'
import ISidebarMenu from '@@/types/ISidebarMenu'
import IDisplayType from '@@/types/IDisplayType'
import { $axios } from '@/utils/api'

import XSidebarMenu from '@/components/organisms/XSidebarMenu.vue'
import XListGroup from '@/components/organisms/XListGroup.vue'
import XCardGroup from '@/components/organisms/XCardGroup.vue'
import XCreateForm from '@/components/organisms/XCreateForm.vue'
import XEditForm from '@/components/organisms/XEditForm.vue'
import XFolderEditForm from '@/components/organisms/XFolderEditForm.vue'
import XTagEditForm from '@/components/organisms/XTagEditForm.vue'
import XMobileView from '@/components/templates/XMobileView.vue'
import XDesktopView from '@/components/templates/XDesktopView.vue'
import { tagStore, bookmarkStore, folderStore, pageStore } from '@/store/index'
import sortTypes from '@/assets/sortTypes.json'
import displayTypes from '@/assets/displayTypes.json'

@Component({
  components: {
    XSidebarMenu,
    XListGroup,
    XCardGroup,
    XCreateForm,
    XEditForm,
    XFolderEditForm,
    XTagEditForm,
    XMobileView,
    XDesktopView
  }
})
export default class Index extends Vue {
  displayType: IDisplayType = displayTypes[0]
  filter: Array<string | ITag> = [] as Array<string | ITag>
  listName: string = 'All bookmarks'
  sidebarMenu: ISidebarMenu = {} as ISidebarMenu
  perPage: number = 10
  pageNo: number = 1
  maxPage: number = 1

  // output md
  selection: string[] = []

  // sort
  sort: ISortType = sortTypes[0]

  // create bookmark
  isBookmarkCreating: boolean = true // true: create mode / false: edit mode
  isLoading: boolean = false // when getting web page info from url

  // edit bookmark
  editingBookmark: IBookmark = {
    _id: '',
    url: '',
    title: '',
    memo: '',
    tag: [] as string[],
    folder: [] as string[],
    domain: '',
    thumbnail: '',
    watchNumber: 0,
    articleCreatedAt: '',
    articleUpdatedAt: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  }

  defaultBookmark: IBookmark = {
    _id: '',
    url: '',
    title: '',
    memo: '',
    tag: [] as string[],
    folder: [] as string[],
    domain: '',
    thumbnail: '',
    watchNumber: 0,
    articleCreatedAt: '',
    articleUpdatedAt: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  }

  // edit folder
  isFolderEditing: boolean = false
  editingFolder: IFolder = {
    _id: '',
    name: '',
    items: [] as Array<string>,
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  }

  defaultFolder: IFolder = {
    _id: '',
    name: '',
    items: [] as Array<string>,
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    updatedBy: ''
  }

  // edit tag
  isTagEditing: boolean = false

  // error
  snackbar: boolean = false
  snackbarText: string = ''
  timeout: number = 2000

  async fetch(context: Context): Promise<void> {
    const { store, $auth, route } = context
    await store.dispatch(`tag/fetchTags`, $auth.user.id)
    await store.dispatch(`folder/fetchFolders`, $auth.user.id)
    await store.dispatch(`bookmark/fetchAllBookmarks`, {
      userId: $auth.user.id
    })
    await store.dispatch(`bookmark/fetchUnfolderedBookmarks`, {
      userId: $auth.user.id
    })

    const folderId = route.params.folderId
    const perPage = store.getters['page/per']
    let listLength
    if (folderId === 'h-0') {
      listLength = store.getters['bookmark/allBookmarks'].length
    } else if (folderId === 'h-1') {
      listLength = store.getters['bookmark/unfolderedBookmarks'].length
    } else {
      const target = store.getters['folder/folderList'].find(
        (d: IFolder) => d._id === folderId
      )
      listLength = target.items.length
    }
    store.dispatch(`page/setTotal`, listLength)
    store.dispatch(`page/setMax`, Math.ceil(listLength / perPage))

    await store.dispatch(`bookmark/fetchDisplayBookmarks`, {
      userId: $auth.user.id,
      pageNo: 1,
      perPage,
      folderId: route.params.folderId,
      filter: [],
      sort: { id: 0 }
    })
  }

  get listLength() {
    const folderId = this.$route.params.folderId
    if (folderId === 'h-0') {
      return bookmarkStore.allBookmarks.length
    } else if (folderId === 'h-1') {
      return bookmarkStore.unfolderedBookmarks.length
    } else {
      const target = folderStore.folderList.find(
        (d: IFolder) => d._id === folderId
      )
      return target ? target.items.length : 0
    }
  }

  get displayBookmarks(): Array<IBookmark> {
    // リストを取得
    return Array.from(bookmarkStore.displayBookmarks)

    /* // sidebar （必ず、1オブジェクト）
    if (Object.keys(this.sidebarMenu).length) {
      if (this.sidebarMenu._id === 'h-0') {
        list = Array.from(bookmarkStore.displayBookmarks) // All bookmarks
      } else if (this.sidebarMenu._id === 'h-1') {
        list = list.filter((d) => d.folder.length === 0) // Unfoldered
      } else if (['m-0', 'm-1'].includes(this.sidebarMenu._id)) {
        // 何も処理をしない // maintenance
      } else {
        // 選択したフォルダに登録されたbookmarkを取得
        const folder = this.$getFolderById(this.sidebarMenu._id)
        if (folder)
          list = folder.items.map(
            (id) => Object.assign({}, this.$getBookmarkById(id)) // storeの値対応
          )
      }
    } */

    // filtering
    /* if (this.filter.length) {
      this.filter.forEach((f) => {
        if (typeof f === 'object') {
          list = list.filter((d) => d.tag.some((t) => t === f._id))
        } else {
          list = list.filter((d) => d.title.includes(f))
        }
      })
    } */

    // sorting
    /* switch (this.sort.id) {
      case 0:
        return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      case 1:
        return list.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
      case 2:
        return list.sort((a, b) => (a.title > b.title ? 1 : -1))
      case 3:
        return list.sort((a, b) => (a.title < b.title ? 1 : -1))
      default:
        return list
    } */
  }

  get tagList(): Array<ITag> {
    return tagStore.tagList
  }

  get folderList(): Array<IFolder> {
    return folderStore.folderList
  }

  get isMobile(): Boolean {
    return this.$vuetify.breakpoint.name === 'xs'
    // return this.$vuetify.breakpoint.xs だとエラーが発生
  }

  get headers(): Array<ISidebarMenu> {
    return [
      {
        _id: 'h-0',
        icon: 'mdi-tab',
        text: 'All bookmarks',
        number: bookmarkStore.allBookmarks.length
      },
      {
        _id: 'h-1',
        icon: 'mdi-tab-unselected',
        text: 'Unfoldered',
        number: bookmarkStore.unfolderedBookmarks.length
      }
    ]
  }

  get folders(): Array<ISidebarMenu> {
    return folderStore.folderList.map((folder: IFolder) => {
      const { _id, name, items } = folder
      return {
        _id,
        icon: 'mdi-folder-outline',
        text: name,
        number: items.length
      }
    })
  }

  get maintenances(): Array<ISidebarMenu> {
    return [
      {
        _id: 'm-0',
        icon: 'mdi-tag',
        text: 'Tags',
        number: tagStore.tagList.length
      }
      /* {
          _id: 'm-1',
          icon: 'mdi-delete',
          text: 'Trash',
          number: 0
        } */
    ]
  }

  get showLoading() {
    return pageStore.number < pageStore.max
  }

  get listTotalNumber() {
    return pageStore.total
  }

  @Watch('displayType')
  onDisplayTypeChange() {
    this.setSelection()
  }

  @Watch('isMobile')
  onIsMobileChange() {
    // mobile ⇔ desktop の描画完了を待って処理を行う
    this.$nextTick(() => this.setSelection())
  }

  @Watch('filter')
  async onFilterChange() {
    pageStore.resetNumber()

    const data = await bookmarkStore.fetchDisplayBookmarks({
      userId: this.$auth.user.id,
      pageNo: 1,
      perPage: pageStore.per,
      folderId: this.$route.params.folderId,
      filter: this.filter,
      sort: this.sort
    })

    await pageStore.setTotal(data[1])
    await pageStore.setMax(Math.ceil(data[1] / pageStore.per))
  }

  /**
   * Methods
   * 【方針】
   *  - CRUD系処理は、Promiseを返却する
   *  - handlerは、try-catch + mode切替 + snackbar
   *  - create系は例外
   */
  // event handler @ topbar
  onSortChange(sort: ISortType) {
    this.sort = sort
    this.reloadDisplayList()
  }

  // event handler @sidebar
  onSidebarMenuClick(item: ISidebarMenu) {
    // mentenance menuの場合
    if (['m-0', 'm-1'].includes(item._id)) {
      this.toggleEditContent(4) // edit tag
      this.toggleMode(3) // [sidebar-edit] mode
    } else {
      this.sidebarMenu = item
      this.listName = item.text
      pageStore.setMax(Math.ceil(item.number / this.perPage))
      pageStore.resetNumber()
      this.$router.push(`/bookmarks/${item._id}`) // routing後, fetchが実行される
      this.toggleMode(1) // [sidebar-list] mode
    }
  }

  onCreateFolderBtnClick(folderName: string) {
    if (folderName) this.createFolder(folderName)
  }

  async onBookmarkDrop(bookmarkId: string, sidebarItem: ISidebarMenu) {
    try {
      const folder = this.$getFolderById(sidebarItem._id)
      const isBookmark = folder
        ? folder.items.find((d) => d === bookmarkId)
        : false
      if (!isBookmark) {
        // const bookmark = this.$getBookmarkById(bookmarkId) // Error: [vuex] do not mutate vuex store state outside mutation handlers.
        const bookmark = await $axios.$get(`/api/v1/bookmarks/${bookmarkId}`)
        if (bookmark) {
          await this.addBookmarkIdToItemsProp(folder._id, bookmarkId) // folderのitemsプロパティにbookmarkIdを登録
          await this.addFolderIdToFolderProp(bookmark, folder._id) // bookmarkのfolderプロパティにfolderIdを登録
          await bookmarkStore.fetchAllBookmarks({ userId: this.$auth.user.id })
          await bookmarkStore.fetchUnfolderedBookmarks({
            userId: this.$auth.user.id
          })
        } else {
          throw new Error('bookmarkの取得に失敗しました。')
        }
      } else {
        this.snack('ブックマークはすでにフォルダ内にあります。')
      }
    } catch (err) {
      this.snack('フォルダへのブックマーク追加に失敗しました。')
    }
  }

  onFolderEditBtnClick(item: ISidebarMenu) {
    this.editingFolder = Object.assign(
      this.defaultFolder,
      this.$getFolderById(item._id)
    )
    this.toggleEditContent(3) // to [edit folder]
    this.toggleMode(3) // to [sidebar-edit]
  }

  async onFolderDeleteBtnClick(_id: string) {
    if (process.browser) {
      if (window.confirm('フォルダを削除してよろしいですか？')) {
        try {
          const array: Promise<IFolder>[] = []
          this.displayBookmarks
            .filter((b) => b.folder.some((d) => d === _id))
            .forEach((d) =>
              array.push(this.updateFolderIdFromFolderProp(d._id, _id))
            )
          await Promise.all(array)
          await folderStore.deleteFolder(_id)
        } catch {
          this.snack('フォルダの削除に失敗しました。')
        }
      }
    }
  }

  // event handler @List
  onDownloadBtnClick() {
    const obj: IBookmark[] = this.selection.map((d) => this.$getBookmarkById(d))
    try {
      this.createMarkdown(obj)
    } catch (err) {
      this.snack(err.message || 'markdownの出力に失敗しました。')
    }
  }

  async onBookmarkTitleClick(_id: string) {
    try {
      await this.updateWatchNumber(this.$getBookmarkById(_id))
    } catch (err) {
      this.snack('閲覧回数の更新に失敗しました。')
    }
  }

  onHashTagClick(_id: string) {
    const target = this.filter.find(
      (d) => typeof d === 'object' && d._id === _id
    )
    if (!target) this.filter.push(this.$getTagById(_id))
  }

  onFolderTextClick(/* _id: string */) {
    // if (process.browser) window.alert(this.$getFolderById(_id))
    // console.log(this.$getFolderById(_id))
  }

  async onListAreaScroll() {
    if (this.showLoading) {
      pageStore.incrementNumber()
      await bookmarkStore.addDisplayBookmarks({
        userId: this.$auth.user.id,
        pageNo: pageStore.number,
        perPage: pageStore.per,
        folderId: this.$route.params.folderId,
        filter: this.filter,
        sort: this.sort
      })
    }
  }

  // event handler @hover element
  async onBrowserOpenBtnClick(_id: string) {
    try {
      await this.updateWatchNumber(this.$getBookmarkById(_id))
    } catch (err) {
      this.snack('閲覧回数の更新に失敗しました。')
    }
  }

  onBookmarkEditBtnClick(_id: string) {
    Object.assign(this.editingBookmark, this.$getBookmarkById(_id))
    this.toggleEditContent(2) // コンテンツ切替(edit bookmark)
    this.toggleMode(2) // to [list-edit] mode
  }

  async onBookmarkRemoveBtnClick(_id: string) {
    if (process.browser) {
      if (window.confirm('ブックマークを削除してよろしいですか？')) {
        try {
          const array: Promise<IFolder>[] = []
          this.folderList
            .filter((f) => f.items.some((d) => d === _id))
            .forEach((folder) => {
              array.push(
                this.removeBookmarkIdFromItemsProps(
                  Object.assign({}, folder),
                  _id
                )
              )
            })

          await Promise.all(array)
          await bookmarkStore.deleteBookmark(_id)
          Object.assign(this.editingBookmark, this.defaultBookmark)
          this.snack('ブックマークを削除しました。')
          this.toggleMode(1) // list viewに戻る
        } catch {
          this.snack('ブックマークの削除に失敗しました。')
        }
      }
    }
  }

  // event handler @edit area
  async onUrlSaveBtnClick(url: string) {
    if (url) await this.createBookmarkByUrl(url)
  }

  async onBookmarkSaveBtnClick(item: IBookmark) {
    try {
      await bookmarkStore.updateBookmark(item)
      this.snack('ブックマークを更新しました。')
      this.toggleMode(1) // list viewに戻る
    } catch {
      this.snack('ブックマークの更新に失敗しました。')
    }
  }

  async onFolderSaveBtnClick(folder: IFolder, bookmarks: string[]) {
    try {
      await this.updateFolderAndBookmarks(folder, bookmarks)
      this.toggleMode(1) // list viewに戻る
    } catch {
      this.snack('フォルダの更新に失敗しました。')
    }
  }

  async onTagDeleteBtnClick(_id: string) {
    if (_id) await this.deleteTag(_id)
  }

  onDuplicateTagName() {
    this.snack('その名前のタグは存在しています。')
  }

  // CRUD Bookmark
  async createBookmarkByUrl(url: string) {
    this.isLoading = true

    try {
      const data = await bookmarkStore.createBookmark({
        url,
        userId: this.$auth.user.id,
        folderId: this.$route.params.folderId
      })

      Object.assign(this.editingBookmark, data)

      this.isLoading = false
      await this.reloadDisplayList()
      this.toggleEditContent(2) // bookmark edit modeへ
    } catch (error) {
      this.snack(error.message || 'ブックマークの保存に失敗しました。')
      this.isLoading = false
    }
  }

  addFolderIdToFolderProp(item: IBookmark, folderId: string) {
    item.folder.push(folderId)
    return bookmarkStore.updateBookmark(item)
  }

  async updateFolderIdFromFolderProp(bookmarkId: string, folderId: string) {
    // const bookmark = this.$getBookmarkById(bookmarkId) // Error: [vuex] do not mutate vuex store state outside mutation handlers.
    const bookmark = await $axios.$get(`/api/v1/bookmarks/${bookmarkId}`)
    bookmark.folder = bookmark.folder.filter((f: string) => f !== folderId)
    return bookmarkStore.updateBookmark(bookmark)
  }

  removeTagIdFromTagProp(tagId: string) {
    const array: Promise<void>[] = []
    const bookmarks = this.displayBookmarks.filter((b) =>
      b.tag.some((t) => t === tagId)
    )
    bookmarks.forEach((b) => {
      b = { ...b }
      b.tag = b.tag.filter((t: string) => t !== tagId)
      array.push(bookmarkStore.updateBookmark(b))
    })
    return Promise.all(array)
  }

  updateWatchNumber(item: IBookmark) {
    const data = Object.assign({}, item, {
      watchNumber: Number(item.watchNumber) + 1
    })
    return bookmarkStore.updateBookmark(data)
  }

  // CRUD Folder
  async createFolder(name: string) {
    try {
      const isName = await $axios.$post('/api/v1/folders/check_name', {
        name
      })
      if (!isName) {
        await folderStore.createFolder({
          name,
          items: [],
          createdBy: this.$auth.user.id,
          updatedBy: this.$auth.user.id
        })
      } else {
        this.snack('その名前のフォルダはすでに存在しています。')
      }
    } catch (err) {
      this.snack('フォルダの作成に失敗しました。。')
    }
  }

  // TODO: 確認
  updateFolderAndBookmarks(folder: IFolder, bookmarks: string[]) {
    const array: Promise<void>[] = []
    array.push(folderStore.updateFolder(folder))
    bookmarks.forEach((b) =>
      array.push(this.updateFolderIdFromFolderProp(b, folder._id))
    )
    return Promise.all(array)
  }

  async addBookmarkIdToItemsProp(folderId: string, bookmarkId: string) {
    // const data = this.$getFolderById(folderItem._id) // Error: [vuex] do not mutate vuex store state outside mutation handlers.
    const data = await $axios.$get(`/api/v1/folders/${folderId}`)
    data.items.push(bookmarkId)
    return folderStore.updateFolder(data)
  }

  async removeBookmarkIdFromItemsProps(
    folderItem: IFolder,
    bookmarkId: string
  ) {
    // const data = this.$getFolderById(folderItem._id) // Error: [vuex] do not mutate vuex store state outside mutation handlers.
    const data = await $axios.$get(`/api/v1/folders/${folderItem._id}`)
    data.items = data.items.filter((f: string) => f !== bookmarkId)
    return folderStore.updateFolder(data)
  }

  // CRUD Tag
  async deleteTag(_id: string) {
    try {
      await this.removeTagIdFromTagProp(_id)
      await tagStore.deleteTag(_id)
    } catch (err) {
      this.snack('タグの削除に失敗しました。')
    }
  }

  // util
  createMarkdown(selection: IBookmark[]) {
    if (process.browser) {
      if (selection.length === 0) {
        this.snack('出力するブックマークが選択されていません。')
        return
      }

      const name = `output_${new Date().toISOString()}`
      const fileName = `${name}.md`

      // md 生成
      let context = `# ${name}\n`
      selection
        .sort((a: IBookmark, b: IBookmark) => b.watchNumber - a.watchNumber)
        .forEach((d: IBookmark) => {
          const head = d.articleUpdatedAt
            ? `- ${d.articleUpdatedAt.substr(0, 10)} `
            : '- '
          context += `${head}[${d.title}](${d.url})\n  ${d.memo}\n`
        })
      const blob = new Blob([context], { type: 'text/plain' })

      // md 出力
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, fileName)
        window.navigator.msSaveOrOpenBlob(blob, fileName) // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
      } else {
        const a = document.createElement('a')
        const url = (window.URL || window.webkitURL).createObjectURL(blob)
        a.href = url
        a.download = fileName

        document.body.appendChild(a) // aタグ要素を画面に一時的に追加する
        a.click()
        document.body.removeChild(a) // 不要になったら削除.
      }
    }
  }

  async reloadDisplayList() {
    pageStore.resetNumber()

    const data = await bookmarkStore.fetchDisplayBookmarks({
      userId: this.$auth.user.id,
      pageNo: 1,
      perPage: pageStore.per,
      folderId: this.$route.params.folderId,
      filter: this.filter,
      sort: this.sort
    })

    await pageStore.setTotal(data[1])
    await pageStore.setMax(Math.ceil(data[1] / pageStore.per))
  }

  toggleMode(mode: number) {
    const desktop = this.$refs.desktop as XDesktopView
    if (desktop) {
      if (mode === 1) desktop.toSidebarListMode()
      if (mode === 2) desktop.toListEditMode()
      if (mode === 3) desktop.toSidebarEditMode()
    }

    const mobile = this.$refs.mobile as XMobileView
    if (mobile) {
      if (mode === 1) mobile.toListMode()
      if (mode === 2) mobile.toEditMode()
      if (mode === 3) mobile.toEditMode()
    }
  }

  toggleEditContent(mode: number) {
    // create bookmark
    if (mode === 1) {
      this.isBookmarkCreating = true
      this.isFolderEditing = false
      this.isTagEditing = false
    }
    // edit bookmark
    if (mode === 2) {
      this.isBookmarkCreating = false
      this.isFolderEditing = false
      this.isTagEditing = false
    }
    // edit folder
    if (mode === 3) {
      this.isBookmarkCreating = false
      this.isFolderEditing = true
      this.isTagEditing = false
    }
    // edit tag
    if (mode === 4) {
      this.isBookmarkCreating = false
      this.isFolderEditing = false
      this.isTagEditing = true
    }
  }

  setSelection() {
    const list =
      (this.$refs['m-list-group'] as XListGroup) ||
      (this.$refs['d-list-group'] as XListGroup)
    const card =
      (this.$refs['m-card-group'] as XCardGroup) ||
      (this.$refs['d-card-group'] as XCardGroup)
    list.onSelectionChange(this.selection)
    card.onSelectionChange(this.selection)
  }

  snack(text: string) {
    this.snackbarText = text
    this.snackbar = true
  }
}
</script>
