var express=require('express');
var router=express.Router({mergeParams:true});
//router is another instance of express
var Campground=require('../models/campground');
var Comment=require('../models/comment');
var middleware=require('../middleware');

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
       if(err){
            console.log(err);
       } else {
            res.render("comments/new", {campground: campground});
       } 
    });
});


//Comments Create
router.post("/",middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash('error','Something went wrong');
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
        if(err){
			req.flash('error','Something went wrong');
            console.log(err);          
            } else {
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
                    campground.comments.push(comment);
                    campground.save();
					console.log(comment);
					req.flash('success','Comment added succcessfully!');
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });

});

//edit comment route
router.get('/:comment_id/edit',middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect('back');
		}
		else{
			res.render('comments/edit',{campground_id:req.params.id,comment:foundComment});
		}
	});	
});

//update comment route
router.put('/:comment_id',middleware.checkCommentOwnership,function(req,res){
	var comment=req.body.comment;
	Comment.findByIdAndUpdate(req.params.comment_id,comment,function(err,updatedComment){
		if(err){
			res.redirect('back');
		}
		else{
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});

//destroy comment route
router.delete('/:comment_id',middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect('back');
		}
		else{
			req.flash('success','Comment deleted succcessfully!');
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});


module.exports=router;