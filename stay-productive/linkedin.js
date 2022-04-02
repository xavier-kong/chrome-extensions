const targetPhrases = [
    'Promoted',
    'likes this',
    'commented on this',
    'celebrates this',
    'loves this',
    'like this',
    'Add to your feed',
    'supports this',
    'Events recommended for you',
    'Jobs recommended for you',
];

function findPosts() {
    const posts = document.querySelectorAll('.feed-shared-update-v2');
    const postsArr = Array.from(posts);
    const badPosts = postsArr.filter(
        (post) =>
            targetPhrases.some((phrase) => post.innerText.includes(phrase)) &&
            post.style.display !== 'none'
    );
    return badPosts;
}

function hidePosts(posts) {
    posts.forEach((post) => {
        post.style.display = 'none';
    });
}

const observer = new MutationObserver(() => {
    const posts = findPosts();
    hidePosts(posts);
});

const config = { attributes: true, childList: true, subtree: true };

observer.observe(document, config);
