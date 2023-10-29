class BlogDTO {
  constructor(blog) {
    this.author = blog.author;
    this.content = blog.content;
    this.title = blog.title;
    this.photo = blog.photoPath;
    this._id = blog._id
  }
}

module.exports = BlogDTO;
