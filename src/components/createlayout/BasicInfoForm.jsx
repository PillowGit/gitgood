"use client";

export default function BasicInfoForm({
  title,
  setTitle,
  description,
  setDescription,
  difficultySum,
  setDifficultySum,
  editMode,
  setEditMode,
  displayPublicly,
  setDisplayPublicly,
  languages,
  setLanguages,
  selectedLanguage,
  setSelectedLanguage,
  tags,
  setTags,
  codeLanguage,
  setCodeLanguage,
}) {
  // Replace the JSX below with your basic info form fields
  return (
<div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter question title"
                className="w-full bg-[#333333] border-none text-white p-3 rounded"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm">
                Description (markdown supported)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter question description"
                className="w-full min-h-[180px] bg-[#333333] border-none text-white p-3 rounded resize-y"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={difficultySum}
                  onChange={(e) => setDifficultySum(parseFloat(e.target.value))}
                  className="w-full"
                />
                {editMode ? (
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={difficultySum}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setDifficultySum(
                        isNaN(val)
                          ? difficultySum
                          : Math.min(10, Math.max(0.1, val))
                      );
                    }}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      setDifficultySum(
                        isNaN(val)
                          ? difficultySum
                          : Math.min(10, Math.max(0.1, val))
                      );
                      setEditMode(false);
                    }}
                    autoFocus
                    className="mt-2 bg-[#333333] rounded px-3 py-1 w-16 text-center"
                  />
                ) : (
                  <div
                    className="mt-2 bg-[#333333] rounded px-3 py-1 w-16 text-center cursor-pointer"
                    onClick={() => setEditMode(true)}
                  >
                    {difficultySum.toFixed(1)}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-center">
                  Display Publicly?
                  <br />
                  If unchecked, your question can only be accessed via link
                </label>
                <div className="flex justify-center items-center h-12">
                  <div className="h-6 w-6 rounded bg-[#333333] flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={displayPublicly}
                      onChange={(e) => setDisplayPublicly(e.target.checked)}
                      className="h-6 w-6 rounded bg-[#333333] accent-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-center">
                  How many test cases should
                  <br />
                  users see?
                </label>
                <div className="flex justify-center">
                  <input
                    type="number"
                    min="0"
                    defaultValue="3"
                    className="w-16 text-center bg-[#333333] border-none text-white p-2 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="languages" className="block text-sm">
                Programming Languages
              </label>
              <div className="flex items-center space-x-2">
                <select
                  id="languages"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-[#333333] border-none text-white p-3 rounded"
                >
                  <option value="">Select a Language</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="Python3">Python3</option>
                  <option value="C">C</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      selectedLanguage &&
                      !languages.includes(selectedLanguage)
                    ) {
                      setLanguages([...languages, selectedLanguage]);
                      setSelectedLanguage("");
                    }
                  }}
                  className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white py-2 px-4 rounded"
                >
                  Add
                </button>
              </div>
              {languages.length > 0 && (
                <ul className="mt-2">
                  {languages.map((lang, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span>{lang}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setLanguages(languages.filter((l) => l !== lang))
                        }
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="block text-sm">
                Question Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(tags).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setTags({
                        ...tags,
                        [tag]: !tags[tag]
                      })
                    }
                    className={`px-3 py-1 rounded ${
                      tags[tag]
                        ? "bg-blue-500 text-white"
                        : "bg-[#333333] text-white"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
  );
}
