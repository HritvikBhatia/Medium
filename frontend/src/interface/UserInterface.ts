export default interface User {
  id: number;
  name: string;
  username: string;
  blog: {
    id:number
    title: string;
    content: string;
    createdAt: string;
    views: number;
    likedBy: {
      username: string;
    }[];
    _count: {
      likedBy: number;
      bookmarkedBy: number;
    };
  }[];
  likedBlogs: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
  }[];
  bookmarkedBlogs: {
    id: number;
    title: string;
    content:string;
    createdAt: string;
  }[];
  _count: {
      likedBlogs: number;
      bookmarkedBlogs: number;
  };
}
