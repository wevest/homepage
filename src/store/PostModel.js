import {MoaConfig} from 'src/data/MoaConfig';


export default class PostPage {
    id = null;
    category = null;
    category_id = null;
    api_categories = null;
    api_tags = null;
    body = null;
    text = null;
    dislike_count=null;
    like_count=null;
    meta=null;
    owner=null;
    pub_date=null;
    read_count=null;
    title=null;

    //computed fields
    is_owner=null;
    category_id=null;
    category_name=null;
    tags=null;
    
    //to check saved
    saved=null;

    // to track content type
    content_type=null;
    reward=0;
    parent_id=null;
    
    constructor() 
    {

    }

    formatTags(tags) {
      let msg = "";
      for (let index=0;index<tags.length;index++) {
        msg += tags[index].name + ",";
      }
      return msg.substring(0,msg.length-1);
    }


    setContentType(value) {
      this.content_type = value;
    }


    assign(obj) {
      //this = new PostPage();
      this.id = obj.id;
      this.api_categories = obj.api_categories;
      this.api_tags = obj.api_tags;
      this.title=obj.title;
      this.body = obj.body;

      this.read_count=obj.read_count;
      this.dislike_count=obj.dislike_count;
      this.like_count=obj.read_count;
      this.meta=obj.meta;
      this.owner=obj.owner;
      this.pub_date=obj.pub_date;        

      this.is_owner = false;        
      // is logged-in?
      if (MoaConfig.auth.id) {
        if (this.owner.id==MoaConfig.auth.id) {
          this.is_owner = true;
        }
      }

      this.category_id=null;
      this.category_name=null;
      if (obj.api_categories.length>0) {
          this.category_id = obj.api_categories[0].id;
          this.category_name = obj.api_categories[0].name;
      }
      
      this.tags = this.formatTags(this.api_tags);

      // for editor
      this.text = null;
  }
  
}