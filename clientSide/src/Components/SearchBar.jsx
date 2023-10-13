import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import styles from "../styles/searchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ setSearchText }) => {
  const [inputText,setInputText] =useState("")
 const onChange = (e) => setInputText(e.target.value);

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (inputText === "") {
      alert("Please enter keyword!");
    } else {
      setSearchText(inputText);
      setInputText("");
      navigate("/searchresult");
    }
  };

 

  return (
    <div className="px-3">
      <form onSubmit={onSubmit} className="bg-gray-200 mt-3">
        <input
          type="text"
          name="text"
          placeholder="search location keyword..."
          value={inputText}
          onChange={onChange}
          className="bg-white p-2 w-3/4 outline-none border"
        />
        <button
          type="submit"
          className="p-2 text-center text-blue-500 w-1/4 bg-white border"
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="sm"
            style={{ color: "#000000" }}
          />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
