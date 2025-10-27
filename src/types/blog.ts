export interface BlogData {
  _id: string;
  title: string;
  content: string;
  image: string;
  category?: string; 
  author: Author | null;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Author {
  _id: string;
  name: string;
  email: string;
}

export interface Comment {
  _id: string;
  user: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  data: BlogData[];
}
