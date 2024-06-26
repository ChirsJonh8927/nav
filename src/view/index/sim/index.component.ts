// @ts-nocheck
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import config from '../../../../nav.config'
import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { INavProps, INavThreeProp } from 'src/types'
import {
  fuzzySearch,
  queryString,
  setWebsiteList,
  toggleCollapseAll,
  totalWeb,
  matchCurrentList,
} from 'src/utils'
import { isLogin } from 'src/utils/user'
import { initRipple } from 'src/utils/ripple'
import { websiteList } from 'src/store'
import { settings } from 'src/store'

@Component({
  selector: 'app-sim',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SimComponent {
  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  gitRepoUrl: string = config.gitRepoUrl
  title: string = settings.title
  simThemeImages = settings.simThemeImages
  simThemeHeight = settings.simThemeHeight
  simThemeAutoplay = settings.simThemeAutoplay
  description: string = settings.simThemeDesc.replace(
    '${total}',
    String(totalWeb())
  )
  isLogin = isLogin
  sliceMax = 1

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(() => {
      const { id, page, q } = queryString()
      this.page = page
      this.id = id
      this.sliceMax = 1

      if (q) {
        this.currentList = fuzzySearch(this.websiteList, q)
      } else {
        this.currentList = matchCurrentList()
      }
      setTimeout(() => {
        this.sliceMax = Number.MAX_SAFE_INTEGER
      }, 100)
    })
  }

  handleJumpUrl(data: any) {
    if (data.url) {
      window.open(data.url)
    }
  }

  ngOnDestroy() {}

  ngAfterViewInit() {
    initRipple()
  }

  handleSidebarNav(index: number) {
    const { page } = queryString()
    this.websiteList[page].id = index
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        page,
        id: index,
        _: Date.now(),
      },
    })
  }

  handleCilckTopNav(idx: number) {
    const id = this.websiteList[idx].id || 0
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        page: idx,
        id,
        _: Date.now(),
      },
    })
  }

  onCollapse = (item: any, index: number) => {
    item.collapsed = !item.collapsed
    this.websiteList[this.page].nav[this.id].nav[index] = item
    setWebsiteList(this.websiteList)
  }

  onCollapseAll = () => {
    toggleCollapseAll(this.websiteList)
  }

  collapsed() {
    try {
      return !!websiteList[this.page].nav[this.id].collapsed
    } catch (error) {
      return false
    }
  }
}
