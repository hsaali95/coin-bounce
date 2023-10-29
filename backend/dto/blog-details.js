class BlogDetailsDto {
  constructor(blog) {
    this.content = blog.content;
    this.title = blog.title;
    this.photo = blog.photoPath;
    this.createdAt = blog.createdAt;
    this._id = blog._id;
    this.authorName = blog.author.name;
    this.authorUsername = blog.author.username;
  }
}
module.exports = BlogDetailsDto;
