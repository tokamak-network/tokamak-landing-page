export const fetchMediumPosts = async () => {
  try {
    const response = await fetch("https://price.api.tokamak.network/posts");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("setPosts error");
    console.log(error);
  }
};
