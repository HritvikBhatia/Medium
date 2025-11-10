export default interface Blog {
  id: number;
  title: string;
  authorId: number
  content: string;
  author: {
    name: string;
  };
  createdAt: string;
  likedBy: {
    username: string;
  }[];
  bookmarkedBy: {
    username: string;
  }[];
  tags:{
    title: string;
  }[];
  views: number;
  _count: {
    likedBy: number;
    bookmarkedBy: number;
  };
}