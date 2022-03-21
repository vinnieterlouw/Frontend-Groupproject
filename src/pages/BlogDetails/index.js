import { useEffect,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { fetchBlogDetails } from "../../store/blog/actions";
import { selectBlogDetail } from "../../store/blog/selector";
import { useParams } from "react-router-dom";
import { Carousel,Card,Form,Button } from "react-bootstrap";
export default function BlogDetail(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const blogdetail = useSelector(selectBlogDetail);

    useEffect(() => {
        console.log("going useeffect");
        dispatch(fetchBlogDetails(id));    
      }, [dispatch,id])
    return (
        <div>
          <div>
          <Card style={{ width: '50rem' }}>
              <Card.Text>
                  {blogdetail.description}
              </Card.Text>
          </Card>
          </div>

           <div style={{height:"520px", width:"530px"}}>
        {blogdetail.moreImages.length>0 ?
      
          <Carousel className = 'mt-5'>
        {blogdetail.moreImages.map((eachimg)=>
        { return (
          <Carousel.Item key={eachimg.id}>
          <img
          className="d-block w-100"
          src={eachimg.ImageUrl}
          alt={blogdetail.title}
        />
          </Carousel.Item>
        )}
         
          )}</Carousel>:"Images yet to Upload"
        }
        </div>
        </div>
    )
}