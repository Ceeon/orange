// 监听扩展图标点击事件
chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage();
});

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  // 创建主菜单
  chrome.contextMenus.create({
    id: "orangeKeyMenu",
    title: "小橘按键",
    contexts: ["all"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("创建菜单出错:", chrome.runtime.lastError);
    } else {
      console.log("成功创建右键菜单");
      // 加载并创建子菜单
      updateContextMenus();
    }
  });
});

// 更新右键菜单
function updateContextMenus() {
  // 先移除所有子菜单
  chrome.contextMenus.removeAll(() => {
    // 重新创建主菜单
    chrome.contextMenus.create({
      id: "orangeKeyMenu",
      title: "小橘按键",
      contexts: ["all"]
    });

    // 从存储中获取书签并创建子菜单
    chrome.storage.sync.get(['bookmarks'], function(result) {
      const bookmarks = result.bookmarks || [];
      
      bookmarks.forEach((bookmark, index) => {
        chrome.contextMenus.create({
          id: `bookmark_${index}`,
          parentId: "orangeKeyMenu",
          title: bookmark.name,
          contexts: ["all"]
        });
      });
    });
  });
}

// 监听存储变化，更新菜单
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.bookmarks) {
    updateContextMenus();
  }
});

// 确保 URL 格式正确
function ensureValidUrl(url) {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith('bookmark_')) {
    const index = parseInt(info.menuItemId.split('_')[1]);
    chrome.storage.sync.get(['bookmarks'], function(result) {
      const bookmarks = result.bookmarks || [];
      if (bookmarks[index]) {
        const url = ensureValidUrl(bookmarks[index].url);
        chrome.tabs.create({
          url: url
        }, (tab) => {
          if (chrome.runtime.lastError) {
            console.error("打开网页失败:", chrome.runtime.lastError);
          } else {
            console.log("成功打开网页:", url);
          }
        });
      }
    });
  }
});
