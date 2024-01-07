interface Post {
  title: string;
  body: string;
  likes: number[];
  createdAt: string;
  comments: Comment[];
}

interface User {
  id: number;
  name: string;
  picture: string;
}
interface Comment {
  userId: number;
  body: string;
  createdAt: string;
}

let posts: Post[] = [];
let users: User[] = [];

async function fetchData() {
  const postsResponse = await fetch(
    "https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/posts.json"
  );
  const postsData = await postsResponse.json();
  posts = postsData;
  const usersResponse = await fetch(
    "https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/users.json"
  );
  const usersData = await usersResponse.json();
  users = usersData;
  getPostDetails(postsData);
}

function getPostDetails(postsData: Post[]) {
  console.log(posts);
  const sortedPosts = postsData.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const postsContainer = document.getElementById("container");

  if (!postsContainer) {
    console.error("Posts container not found");
    return;
  }

  const postsList = document.createElement("ul");
  postsList.classList.add("posts-list");

  sortedPosts.forEach((post) => {
    console.log(post);
    const postItem = createPostListItem(post, users);
    postsList.appendChild(postItem);
  });
  console.log(postsList);
  postsContainer.appendChild(postsList);
}

function createPostListItem(post: Post, usersData: User[]): HTMLElement {
  const postItem = document.createElement("li");
  postItem.classList.add("post-item");

  const titleElement = document.createElement("h2");
  titleElement.textContent = post.title;

  const bodyElement = document.createElement("p");
  bodyElement.textContent = post.body;

  const likesElement = document.createElement("span");
  likesElement.textContent = post.likes.length.toString();
  const dateElement = document.createElement("span");
  dateElement.textContent = new Date(post.createdAt).toLocaleString("pt");

  const commentsContainer = document.createElement("div");
  commentsContainer.classList.add("comments-container");

  post.comments.forEach((comment: Comment) => {
    const commentElement = document.createElement("div");
    commentElement.classList.add("comment");

    const commentUser = usersData.find((user) => user.id === comment.userId);
    console.log(comment);

    const commentpictureElement = document.createElement("img");
    commentpictureElement.src = commentUser?.picture ?? "";
    commentElement.appendChild(commentpictureElement);

    const commentUserElement = document.createElement("span");
    commentUserElement.textContent = commentUser?.name + ": ";
    commentElement.appendChild(commentUserElement);

    const commentBodyElement = document.createElement("span");
    commentBodyElement.textContent = comment.body;
    commentElement.appendChild(commentBodyElement);

    const commentDateElement = document.createElement("span");
    commentDateElement.textContent = new Date(comment.createdAt).toLocaleString(
      "pt"
    );
    commentElement.appendChild(commentDateElement);

    commentsContainer.appendChild(commentElement);
  });

  postItem.appendChild(titleElement);
  postItem.appendChild(bodyElement);
  postItem.appendChild(likesElement);
  postItem.appendChild(dateElement);
  postItem.appendChild(commentsContainer);

  return postItem;
}

fetchData();
console.log("Running");

function searchPost(): any {
  const input = document.getElementById("searchBar") as HTMLInputElement;

  const searchTerm = input.value.toLowerCase().trim();

  console.log("posts depois search", posts);
  const filterPost = posts.filter((post) => {
    return post.title.toLowerCase().includes(searchTerm);
  });

  const postsContainer = document.getElementById("container");
  if (postsContainer) {
    postsContainer.innerHTML = "";
  }
  showPostsFound(filterPost.length);
  getPostDetails(filterPost);
}

function submitPost(newPost: Post): void {
  posts.unshift(newPost);

  const postsContainer = document.getElementById("container");
  if (postsContainer) {
    postsContainer.innerHTML = "";
  }

  getPostDetails(posts);
}

function showPostsFound(count: number): void {
  const countContainer = document.createElement("div");
  countContainer.textContent = `Number of posts found: ${count}`;

  const postsContainer = document.getElementById("container");
  if (postsContainer) {
    postsContainer.appendChild(countContainer);
  }
}

const newPostNode = document.getElementById("postForm");

newPostNode?.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputtextTitle = document.getElementById(
    "postTitleName"
  ) as HTMLInputElement;

  const textTitle = inputtextTitle.value;

  const imputTextBody = document.getElementById(
    "postContent"
  ) as HTMLInputElement;

  const textBody = imputTextBody.value;

  const newPost: Post = {
    title: textTitle,
    body: textBody,
    createdAt: new Date().toISOString(),
    comments: [],
    likes: [],
  };

  submitPost(newPost);
});
