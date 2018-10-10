class News {
    constructor(
      {
        id = '***',
        title = '',
        time = '',
        author = '',
        url = '',
        image = '',
        type = '',
        click_count = ''
      }
    ) {
      this.id = id;
      this.title = title;
      this.time = time;
      this.author = author;
      this.url = url;
      this.image = image;
      this.type = type;
      this.click_count = click_count;
    }
  }
  
  export default News;
  