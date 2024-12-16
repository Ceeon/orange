// 在页面加载时获取保存的书签
document.addEventListener('DOMContentLoaded', function() {
  loadBookmarks();
  initializeEventListeners();
});

// 初始化事件监听器
function initializeEventListeners() {
  // 添加按钮点击事件
  const addButton = document.getElementById('addButton');
  if (addButton) {
    addButton.addEventListener('click', handleAddBookmark);
  }
}

// 处理添加书签
function handleAddBookmark() {
  const name = document.getElementById('newName').value.trim();
  let url = document.getElementById('newUrl').value.trim();
  
  if (!name || !url) {
    showToast('请填写名称和网址');
    return;
  }

  // 确保 URL 格式正确
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  // 保存新书签
  chrome.storage.sync.get(['bookmarks'], function(result) {
    const bookmarks = result.bookmarks || [];
    bookmarks.push({ name, url });
    
    chrome.storage.sync.set({ bookmarks }, function() {
      showToast('添加成功');
      loadBookmarks();
      // 清空输入框
      document.getElementById('newName').value = '';
      document.getElementById('newUrl').value = '';
    });
  });
}

// 加载书签列表
function loadBookmarks() {
  const bookmarkList = document.getElementById('bookmarkList');
  if (!bookmarkList) return;
  
  bookmarkList.innerHTML = '';

  chrome.storage.sync.get(['bookmarks'], function(result) {
    const bookmarks = result.bookmarks || [];
    
    bookmarks.forEach((bookmark, index) => {
      const div = document.createElement('div');
      div.className = 'weui-cell bookmark-item';
      
      const content = document.createElement('div');
      content.className = 'weui-cell__bd';
      
      const nameP = document.createElement('p');
      nameP.textContent = bookmark.name;
      
      const urlP = document.createElement('p');
      urlP.style.fontSize = '13px';
      urlP.style.color = '#888888';
      urlP.textContent = bookmark.url;
      
      content.appendChild(nameP);
      content.appendChild(urlP);
      
      const btnContainer = document.createElement('div');
      btnContainer.className = 'weui-cell__ft';
      
      const deleteBtn = document.createElement('a');
      deleteBtn.className = 'weui-btn weui-btn_mini weui-btn_warn delete-btn';
      deleteBtn.textContent = '删除';
      deleteBtn.dataset.index = index;
      deleteBtn.addEventListener('click', () => deleteBookmark(index));
      
      btnContainer.appendChild(deleteBtn);
      div.appendChild(content);
      div.appendChild(btnContainer);
      bookmarkList.appendChild(div);
    });
  });
}

// 删除书签
function deleteBookmark(index) {
  chrome.storage.sync.get(['bookmarks'], function(result) {
    const bookmarks = result.bookmarks || [];
    bookmarks.splice(index, 1);
    
    chrome.storage.sync.set({ bookmarks }, function() {
      showToast('删除成功');
      loadBookmarks();
    });
  });
}

// 显示提示消息
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'weui-toast';
  
  const icon = document.createElement('i');
  icon.className = 'weui-icon-success-no-circle weui-icon_toast';
  
  const content = document.createElement('p');
  content.className = 'weui-toast__content';
  content.textContent = message;
  
  toast.appendChild(icon);
  toast.appendChild(content);
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentNode) {
      document.body.removeChild(toast);
    }
  }, 2000);
}
