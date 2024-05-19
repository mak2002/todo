import React, { useState } from "react";

const InputModal = ({ showModal, onClose }: any) => {
  const [inputType, setInputType] = useState("text");
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleImageChange = (file: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setInputValue(reader.result as string);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: any) => {
    // Handle the submitted input based on its type
    switch (inputType) {
      case "text":
        // Handle text input
        break;

      case "image":
        // Handle image input
        break;
      default:
        // Handle default case
        break;
    }

    // Close the modal after handling the input
    onClose(e, );
  };

  return (
    true && (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-8 rounded-lg w-96 shadow-xl">
          <h2 className="text-xl mb-4">Progress Log</h2>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full mb-2"
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
          {/* Conditional rendering based on inputType */}
          {inputType === "text" && (
            <textarea
              className="border border-gray-300 rounded-md p-2 w-full mb-2"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter text..."
            />
          )}
          {inputType === "link" && (
            <input
              type="url"
              className="border border-gray-300 rounded-md p-2 w-full mb-2"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter link..."
            />
          )}
          {inputType === "video" && (
            <input
              type="url"
              className="border border-gray-300 rounded-md p-2 w-full mb-2"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter video URL..."
            />
          )}
          {inputType === "image" && (
            <input
              type="file"
              accept="image/*"
              className="border border-gray-300 rounded-md p-2 w-full mb-2"
              onChange={(e) => handleImageChange(e.target.files)}
            />
          )}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    )
  );
};

export default InputModal;
