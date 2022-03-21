import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogDetails } from "../../store/blog/actions";
import { selectBlogDetail } from "../../store/blog/selector";
import { useParams } from "react-router-dom";
import { Carousel, Card, Form, Button } from "react-bootstrap";

export default function BlogDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blogdetail = useSelector(selectBlogDetail);
  useEffect(() => {
    console.log("going here")
    dispatch(fetchBlogDetails(id));
  }, [dispatch, id]);
  return (
    <div  className="flex flex-col md:flex-row md:max-w-l md:h-30 rounded-lg bg-white shadow-lg" >
      <div className="flex justify-left m-3">
        
          {blogdetail.description}
        
      </div>

      <div className="w-500">
        {!blogdetail ? "Loading" : blogdetail.moreImages?.length > 0 ? (
          <Carousel className="mt-5">
            {blogdetail.moreImages.map((eachimg) => {
              return (
                <Carousel.Item key={eachimg.id}>
                  <img
                    className="d-block w-100 object-fill:fill"
                    src={eachimg.ImageUrl}
                    alt={blogdetail.title}
                  />
                </Carousel.Item>
              );
            })}
          </Carousel>
        ) : (
          "Images yet to Upload"
        )}
      </div>
    </div>
  );
}
