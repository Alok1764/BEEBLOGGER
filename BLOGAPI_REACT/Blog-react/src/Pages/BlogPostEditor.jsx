import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../Contexts/ToastContext";
import CategorySelector, {
  AddCategoryModal,
} from "../components/CategorySelector";
import {
  FaSave,
  FaEye,
  FaCode,
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaHeading,
  FaImage,
  FaArrowLeft,
  FaUpload,
} from "react-icons/fa";

const BlogPostEditor = ({ authorId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    categoryIds: [],
    authorId: null,
  });

  // Auto-save to localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem(`blog-draft-${id || "new"}`);
    if (savedDraft && !id) {
      const draft = JSON.parse(savedDraft);
      setPostData(draft.postData);
    } else if (id) {
      fetchPost();
    }
  }, [id]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (postData.title || postData.content) {
        saveToDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [postData]);

  const fetchPost = async () => {
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      const res = await fetch(`http://localhost:8080/api/v1/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPostData({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || "",
          image: data.image || "",
          categoryIds: data.categories
            ? data.categories.map((cat) => cat.id)
            : [],
        });
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
    }
  };

  const saveToDraft = () => {
    localStorage.setItem(
      `blog-draft-${id || "new"}`,
      JSON.stringify({ postData, savedAt: new Date().toISOString() })
    );
    setLastSaved(new Date());
  };

  // 4. Handle category changes
  const handleCategoryChange = (selectedIds) => {
    setPostData((prev) => ({
      ...prev,
      categoryIds: selectedIds,
    }));
  };
  const handleCategoryAdded = (newCategory) => {
    // Auto-select the newly created category
    setPostData((prev) => ({
      ...prev,
      categoryIds: [...prev.categoryIds, newCategory.id],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const insertMarkdown = (type) => {
    const textarea = document.getElementById("content-editor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postData.content.substring(start, end);
    let newText = postData.content;

    switch (type) {
      case "bold":
        newText =
          postData.content.substring(0, start) +
          `**${selectedText || "bold text"}**` +
          postData.content.substring(end);
        break;
      case "italic":
        newText =
          postData.content.substring(0, start) +
          `*${selectedText || "italic text"}*` +
          postData.content.substring(end);
        break;
      case "heading":
        newText =
          postData.content.substring(0, start) +
          `## ${selectedText || "Heading"}` +
          postData.content.substring(end);
        break;
      case "code":
        newText =
          postData.content.substring(0, start) +
          `\`\`\`\n${selectedText || "// Your code here"}\n\`\`\`` +
          postData.content.substring(end);
        break;
      case "ul":
        newText =
          postData.content.substring(0, start) +
          `- ${selectedText || "List item"}` +
          postData.content.substring(end);
        break;
      case "ol":
        newText =
          postData.content.substring(0, start) +
          `1. ${selectedText || "List item"}` +
          postData.content.substring(end);
        break;
      default:
        break;
    }

    setPostData((prev) => ({ ...prev, content: newText }));
    setTimeout(() => textarea.focus(), 0);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData((prev) => ({
          ...prev,
          image: reader.result,
        }));
        toast.success("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePost = () => {
    if (!postData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!postData.content.trim()) {
      toast.error("Content is required");
      return false;
    }
    if (!postData.categoryId) {
      toast.error("Please select a category");
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!postData.title.trim() && !postData.content.trim()) {
      toast.warning("Nothing to save");
      return;
    }

    setIsSaving(true);
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      const endpoint = id
        ? `http://localhost:8080/api/v1/posts/${id}`
        : "http://localhost:8080/api/v1/posts/create";

      const method = id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...postData,
          published: false, // Keep as draft
        }),
      });

      if (!res.ok) throw new Error("Failed to save draft");

      const savedPost = await res.json();

      // Clear local draft
      localStorage.removeItem(`blog-draft-${id || "new"}`);

      toast.success("Draft saved successfully");

      // Navigate to the edit page if it was a new post
      if (!id) {
        navigate(`/editor/${savedPost.id}`);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
      saveToDraft(); // Save locally as backup
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validatePost()) return;

    setIsSaving(true);
    try {
      const tokenString = localStorage.getItem("jwtToken");
      const tokenObj = JSON.parse(tokenString);
      const token = tokenObj.jwtToken;

      // First, create/update the post
      const endpoint = id
        ? `http://localhost:8080/api/v1/posts/${id}`
        : "http://localhost:8080/api/v1/posts/create";

      const method = id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!res.ok) throw new Error("Failed to save post");

      const savedPost = await res.json();

      // Then publish it
      const publishRes = await fetch(
        `http://localhost:8080/api/v1/posts/${savedPost.id}/publish`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!publishRes.ok) throw new Error("Failed to publish post");

      // Clear draft from localStorage
      localStorage.removeItem(`blog-draft-${id || "new"}`);

      toast.success("Post published successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Failed to publish post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (postData.title || postData.content) {
      if (window.confirm("Save draft before leaving?")) {
        saveToDraft();
      }
    }
    navigate("/my-posts");
  };

  const renderPreview = () => {
    let html = postData.content;

    // Code blocks
    html = html.replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-orange-500 text-white p-4 my-4 overflow-x-auto font-mono text-sm"><code>$1</code></pre>'
    );

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Headings
    html = html.replace(
      /## (.*?)(\n|$)/g,
      '<h2 class="text-3xl font-bold font-mono tracking-tighter text-orange-500 my-6">$1</h2>'
    );

    // Bullet Lists
    html = html.replace(/^- (.*?)$/gm, '<li class="ml-6 my-2">• $1</li>');

    // Numbered Lists
    html = html.replace(
      /^(\d+)\. (.*?)$/gm,
      '<li class="ml-6 my-2">$1. $2</li>'
    );

    // Line breaks
    html = html.replace(/\n/g, "<br>");

    return html;
  };

  return (
    <div className="bg-white min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-12 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 pb-6 border-b border-orange-500">
          <div className="flex items-center gap-6">
            <button
              onClick={handleClose}
              className="text-orange-500 hover:opacity-50 transition-opacity"
            >
              <FaArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold font-mono tracking-tighter text-orange-500">
                {id ? "EDIT POST" : "CREATE POST"}
              </h1>
              {lastSaved && (
                <p className="text-xs font-mono text-orange-500 opacity-50 mt-2">
                  AUTO-SAVED: {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-6 py-3 border border-orange-500 text-orange-500 font-mono text-sm tracking-widest hover:bg-orange-500 hover:text-white transition-all"
            >
              <FaEye />
              {showPreview ? "EDIT" : "PREVIEW"}
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 border border-orange-500 text-orange-500 font-mono text-sm tracking-widest hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
            >
              <FaSave />
              {isSaving ? "SAVING..." : "SAVE DRAFT"}
            </button>

            <button
              onClick={handlePublish}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-mono text-sm tracking-widest hover:bg-orange-600 border border-orange-500 transition-all disabled:opacity-50"
            >
              {isSaving ? "PUBLISHING..." : "PUBLISH"}
            </button>
          </div>
        </div>

        {!showPreview ? (
          <div className="space-y-8">
            {/* Title */}
            <div>
              <label className="block font-mono text-xs tracking-widest text-orange-500 mb-3">
                TITLE *
              </label>
              <input
                type="text"
                name="title"
                value={postData.title}
                onChange={handleInputChange}
                placeholder="ENTER YOUR POST TITLE..."
                className="w-full p-4 border-2 border-orange-500 font-mono text-2xl tracking-tight text-orange-500 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-orange-500 placeholder:opacity-30"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block font-mono text-xs tracking-widest text-orange-500 mb-3">
                CATEGORIES *
              </label>
              <CategorySelector
                selectedCategoryIds={postData.categoryIds}
                onChange={handleCategoryChange}
                onAddCategory={() => setShowAddCategoryModal(true)}
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block font-mono text-xs tracking-widest text-orange-500 mb-3">
                FEATURED IMAGE
              </label>
              <div className="flex gap-6 items-start">
                {postData.image && (
                  <div className="border-2 border-orange-500 p-2">
                    <img
                      src={postData.image}
                      alt="Preview"
                      className="w-48 h-48 object-cover"
                    />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="px-8 py-4 border-2 border-orange-500 text-orange-500 font-mono text-sm tracking-widest hover:bg-orange-500 hover:text-white transition-all inline-flex items-center gap-3">
                    <FaUpload />
                    {postData.image ? "CHANGE IMAGE" : "UPLOAD IMAGE"}
                  </div>
                </label>
              </div>
              <p className="text-xs font-mono text-orange-500 opacity-50 mt-2">
                MAX 5MB • JPG, PNG, GIF
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block font-mono text-xs tracking-widest text-orange-500 mb-3">
                EXCERPT
              </label>
              <textarea
                name="excerpt"
                value={postData.excerpt}
                onChange={handleInputChange}
                placeholder="BRIEF DESCRIPTION OF YOUR POST..."
                className="w-full p-4 border-2 border-orange-500 font-mono text-sm tracking-wider text-orange-500 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-orange-500 placeholder:opacity-30"
                rows="3"
              />
            </div>

            {/* Markdown Toolbar */}
            <div className="border-2 border-orange-500 p-3">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => insertMarkdown("bold")}
                  className="p-3 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                  title="Bold"
                >
                  <FaBold />
                </button>
                <button
                  onClick={() => insertMarkdown("italic")}
                  className="p-3 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                  title="Italic"
                >
                  <FaItalic />
                </button>
                <button
                  onClick={() => insertMarkdown("heading")}
                  className="p-3 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                  title="Heading"
                >
                  <FaHeading />
                </button>
                <button
                  onClick={() => insertMarkdown("code")}
                  className="p-3 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                  title="Code Block"
                >
                  <FaCode />
                </button>
                <button
                  onClick={() => insertMarkdown("ul")}
                  className="p-3 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                  title="Bullet List"
                >
                  <FaListUl />
                </button>
                <button
                  onClick={() => insertMarkdown("ol")}
                  className="p-3 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                  title="Numbered List"
                >
                  <FaListOl />
                </button>
                <span className="ml-auto text-xs font-mono text-orange-500 opacity-50">
                  SELECT TEXT AND CLICK TO FORMAT
                </span>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block font-mono text-xs tracking-widest text-orange-500 mb-3">
                CONTENT * (MARKDOWN SUPPORTED)
              </label>
              <textarea
                id="content-editor"
                name="content"
                value={postData.content}
                onChange={handleInputChange}
                placeholder="WRITE YOUR CONTENT HERE...

MARKDOWN EXAMPLES:
**bold text**
*italic text*
## Heading
```
code block
```
- bullet list
1. numbered list"
                className="w-full p-6 border-2 border-orange-500 font-mono text-sm leading-relaxed tracking-wider text-orange-500 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none placeholder:text-orange-500 placeholder:opacity-30"
                rows="24"
              />
            </div>
          </div>
        ) : (
          // Preview Mode
          <div className="border-2 border-orange-500 p-12">
            <h1 className="text-5xl font-bold font-mono tracking-tighter text-orange-500 mb-6">
              {postData.title || "UNTITLED POST"}
            </h1>

            {postData.image && (
              <div className="border-2 border-orange-500 mb-8">
                <img
                  src={postData.image}
                  alt="Featured"
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {postData.excerpt && (
              <div className="mb-8 pb-6 border-l-4 border-orange-500 pl-6">
                <p className="text-lg font-mono text-orange-500 opacity-70 italic">
                  {postData.excerpt}
                </p>
              </div>
            )}

            <div
              className="font-mono text-orange-500 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderPreview() }}
            />
          </div>
        )}
      </div>
      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
};

export default BlogPostEditor;
