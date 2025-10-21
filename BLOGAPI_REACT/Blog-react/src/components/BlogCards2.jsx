import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";

const BlogCards2 = ({ blogs, isLoggedIn, onAuthRequired }) => {
  const navigate = useNavigate();

  const handleBlogClick = (e, blogId) => {
    e.preventDefault();

    if (!isLoggedIn) {
      onAuthRequired();
    } else {
      navigate(`/blogs/${blogId}`);
    }
  };

  return (
    <div className="border border-orange-500 bg-white p-8 flex-1 shadow-md">
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={(e) => handleBlogClick(e, blog.id)}
            className="p-6 bg-white border border-orange-500 hover:bg-orange-500 hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group flex flex-col cursor-pointer"
          >
            <div className="overflow-hidden mb-6 rounded-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>

            <h3 className="mb-4 font-bold font-mono text-xl tracking-tighter text-orange-500 group-hover:text-white transition-colors">
              {blog.title.toUpperCase()}
            </h3>

            <p className="mb-3 flex items-center text-sm font-mono tracking-wider opacity-70">
              <FaUser className="inline mr-2" />
              {blog.authorDTO.userName.toUpperCase()}
            </p>

            <p className="text-xs font-mono tracking-widest opacity-70">
              PUBLISHED: <span className="italic">DATE TO UPDATE</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCards2;

// const BlogCards2 = ({ blogs, isLoggedIn, onAuthRequired }) => {
//   const navigate = useNavigate();

//   const handleBlogClick = (e, blogId, isPublished) => {
//     e.preventDefault();

//     if (!isPublished && !isLoggedIn) {
//       // Draft post, not logged in - show modal
//       onAuthRequired();
//     } else if (!isLoggedIn) {
//       // Published post, not logged in - show preview or require login
//       // Option 1: Allow preview
//       navigate(`/blogs/${blogId}/preview`);

//       // Option 2: Require login for all
//       // onAuthRequired();
//     } else {
//       // Logged in - full access
//       navigate(`/blogs/${blogId}`);
//     }
//   };

//   return (
//     <div className="border border-orange-500 bg-white p-8 flex-1 shadow-md">
//       <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
//         {blogs.map((blog) => (
//           <div
//             key={blog.id}
//             onClick={(e) => handleBlogClick(e, blog.id, blog.published)}
//             className="p-6 bg-white border border-orange-500 hover:bg-orange-500 hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group flex flex-col cursor-pointer relative"
//           >
//             {/* Lock Icon for non-logged users */}
//             {!isLoggedIn && (
//               <div className="absolute top-4 right-4 bg-orange-500 text-white p-2 rounded">
//                 <span className="font-mono text-xs">🔒</span>
//               </div>
//             )}

//             <div className="overflow-hidden mb-6 rounded-lg">
//               <img
//                 src={blog.image}
//                 alt={blog.title}
//                 className={`w-full h-48 object-cover transition-all duration-300 ${
//                   !isLoggedIn
//                     ? "grayscale blur-sm"
//                     : "grayscale group-hover:grayscale-0"
//                 }`}
//               />
//             </div>

//             <h3 className="mb-4 font-bold font-mono text-xl tracking-tighter text-orange-500 group-hover:text-white transition-colors">
//               {blog.title.toUpperCase()}
//             </h3>

//             <p className="mb-3 flex items-center text-sm font-mono tracking-wider opacity-70">
//               <FaUser className="inline mr-2" />
//               {blog.authorDTO.name.toUpperCase()}
//             </p>

//             <p className="text-xs font-mono tracking-widest opacity-70">
//               PUBLISHED: <span className="italic">DATE TO UPDATE</span>
//             </p>

//             {!isLoggedIn && (
//               <div className="mt-4 pt-4 border-t border-orange-500">
//                 <p className="text-xs font-mono tracking-widest text-orange-500 opacity-70">
//                   LOGIN TO READ FULL ARTICLE
//                 </p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
