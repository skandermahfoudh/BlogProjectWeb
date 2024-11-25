import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/service/comment.service';
import { PostService } from 'src/app/service/post.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent {

  postId = this.activatedRoute.snapshot.params['id'];
  postData:any;
  comments:any;
  commentForm!: FormGroup;

  constructor(private postService: PostService , 
    private activatedRoute: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private fb: FormBuilder,
    private commentService: CommentService) { }

  ngOnInit() {

    console.log(this.postId);
    this.getPostById();
    this.commentForm = this.fb.group({
      postedBy:[null, Validators.required],
      content: [null, Validators.required]
    })
  }

  publishComment(){
    const postedBy= this.commentForm.get('postedBy')?.value;
    const content= this.commentForm.get('content')?.value;
    this.commentService.createComment(this.postId, postedBy, content).subscribe(res=>{
      this.matSnackBar.open("Comment Published Successfully" , "OK");
      this.getCommentByPost();
    },error=>{
      this.matSnackBar.open("Something went wrong!!!!" , "OK");
    }
  )
  }

  getCommentByPost(){
    this.commentService.getAllCommentByPost(this.postId).subscribe(res=>{
      this.comments = res;
    },error=>{
      this.matSnackBar.open("Something went wrong!!!!" , "OK");
    }
    
  )
  }

  getPostById(){
    this.postService.getPostById(this.postId).subscribe(res=>{
      this.postData = res;
      console.log(res);
      this.getCommentByPost();
    },error=>{
      this.matSnackBar.open("Something went wrong!!!!" , "OK");
    }
    
  )
  }

  likePost(){
    this.postService.likePost(this.postId).subscribe((response)=>{
      this.matSnackBar.open("Post Liked Successfully!");
      this.getPostById();
    },(error)=>{
      this.matSnackBar.open("Something went wrong!!!", "Ok")
    }
  )
  }

}
