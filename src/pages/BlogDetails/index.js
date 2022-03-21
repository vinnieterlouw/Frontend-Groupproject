import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogDetails } from "../../store/blog/actions";
import { selectBlogDetail } from "../../store/blog/selector";
import { useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "../BlogDetails/blogdetail.css";

export default function BlogDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blogdetail = useSelector(selectBlogDetail);
  useEffect(() => {
    console.log("going here");
    dispatch(fetchBlogDetails(id));
  }, [dispatch, id]);

  return (
    <div className="flex flex-col md:flex-row md:max-w-m  rounded-lg bg-white shadow-lg m-12">
      <div className="flex flex-col  m-10 ">
        <h5 className="text-gray-900 text-xl font-medium mb-2">
          {blogdetail.name_of_place}
        </h5>
        <p>{blogdetail.description}</p>
      </div>

      <div className="mt-15 mr-5 max-w-100 max-h-100">
        {!blogdetail ? (
          "Loading"
        ) : blogdetail.moreImages?.length > 0 ? (
          <Carousel>
            {blogdetail.moreImages.map((eachimg) => {
              return (
                <Carousel.Item key={eachimg.id}>
                  <img src={eachimg.ImageUrl} alt={blogdetail.title} />
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
