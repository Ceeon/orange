// 获取书签列表容器
const bookmarkList = document.getElementById('bookmarkList');
const searchInput = document.getElementById('searchInput');

// 加载书签
function loadBookmarks() {
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    displayBookmarks(bookmarkTreeNodes);
  });
}

// 显示书签
function displayBookmarks(bookmarkNodes) {
  bookmarkList.innerHTML = '';
  
  function createBookmarkElement(node) {
    const div = document.createElement('div');
    div.className = 'weui-cells';
    
    if (node.children) {
      // 文件夹
      const folderDiv = document.createElement('div');
      folderDiv.className = 'weui-cells__title';
      folderDiv.textContent = node.title || '根目录';
      div.appendChild(folderDiv);
      
      node.children.forEach(child => {
        div.appendChild(createBookmarkElement(child));
      });
    } else {
      // 书签
      const a = document.createElement('a');
      a.className = 'weui-cell weui-cell_access';
      a.href = node.url;
      a.target = '_blank';
      
      const content = document.createElement('div');
      content.className = 'weui-cell__bd';
      content.textContent = node.title;
      
      a.appendChild(content);
      div.appendChild(a);
    }
    
    return div;
  }
  
  bookmarkNodes.forEach(node => {
    bookmarkList.appendChild(createBookmarkElement(node));
  });
}

// 搜索书签
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  chrome.bookmarks.search(query, (results) => {
    if (query) {
      displayBookmarks([{
        children: results
      }]);
    } else {
      loadBookmarks();
    }
  });
});

// 初始加载
loadBookmarks();
