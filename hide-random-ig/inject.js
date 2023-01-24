function filterNodes(tagName, filterPhrases) {
    const nodes = document.getElementsByTagName(tagName);
    const nodeArr = Array.from(nodes);

    const badNodes = nodeArr.filter(
        (node) =>
            filterPhrases.some((phrase) => node.innerHTML.includes(phrase)) &&
            node.style.display !== 'none'
        )

    return badNodes;
}

function fetchViaSelector(selector) {
    const nodes = document.querySelectorAll(selector);
    const nodesArr = Array.from(nodes);
    return nodesArr;
}

function findPosts() {
    return [
        ...filterNodes('article', ['追蹤', 'Follow']),
        ...filterNodes('a', ['past_posts', '查看先前的貼文']),
        ...filterNodes('span', ['建議貼文']),
        ...fetchViaSelector('[data-visualcompletion="loading-state"]'),
        ...fetchViaSelector('[src="/images/instagram/xig/web/illo-confirm-refresh-light.png"]'),
        ...fetchViaSelector('[href="/explore/people/"]'),
        ...fetchViaSelector('[href="/reels/videos/"]'),
        ...fetchViaSelector('[href="/explore/"]')
    ]
}

function hidePosts(posts) {
    posts.forEach((post) => {
        try {
            post.style.display = 'none';
        } catch (e) {
            console.log(e);
        }
    });
}

const observer = new MutationObserver(() => {
    const posts = findPosts();
    hidePosts(posts);
});

const config = { attributes: true, childList: true, subtree: true };

observer.observe(document, config);
