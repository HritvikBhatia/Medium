export default interface Blog {
  id: number;
  title: string;
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
  _count: {
    likedBy: number;
    bookmarkedBy: number;
  };
}