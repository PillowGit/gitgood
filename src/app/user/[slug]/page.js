"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function UserProfile() {
  // Auth session
  const { data: session } = useSession();
  // User slug
  const params = useParams();
  const slug = params.slug;

  // State for the user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for challenge details
  const [challengeDetails, setChallengeTitles] = useState({});
  const [loadingChallenges, setLoadingChallenges] = useState(false);

  // State for editable settings
  const [displayName, setDisplayName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [settings, setSettings] = useState({
    points_are_public: true,
    accepted_are_public: true,
    ownership_is_public: true
  });

  // Check if the current user is viewing their own profile
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    if (!user || loading) {
      // Fetch user data
      fetch(`/api/users/${slug}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setUser(data);
            setDisplayName(data.display_name);
            if (data.points_are_public !== undefined) {
              setSettings({
                points_are_public: data.points_are_public,
                accepted_are_public: data.accepted_are_public,
                ownership_is_public: data.ownership_is_public
              });
            }

            // Check if this is the logged-in user's profile
            if (session?.user && session.user.image) {
              const match = session.user.image.match(/githubusercontent.com\/u\/(\d+)/)[1];
              if (match && match === data.github_id) {
                setIsOwnProfile(true);
              }
            }

            // Fetch challenge details for accepted and created challenges
            fetchChallengeDetails(data);
          }
          setLoading(false);
        })
        .catch(err => {
          setError("Failed to load profile data");
          setLoading(false);
        });
    }
  }, [slug, session]);

  // Fetch challenge details (titles) for all challenge IDs
  const fetchChallengeDetails = async (userData) => {
    const challengeIds = [
      ...(userData.created || []),
      ...(userData.accepted || [])
    ];

    if (challengeIds.length === 0) return;

    setLoadingChallenges(true);
    const details = {};

    try {
      // Fetch details for each challenge
      const fetchPromises = challengeIds.map(async (id) => {
        try {
          const res = await fetch(`/api/questions/${id}`, { cache: "force-cache" });
          if (res.ok) {
            const data = await res.json();
            return { id, title: data.metadata?.title || 'Untitled Challenge' };
          }
          return { id, title: 'Challenge Not Found' };
        } catch (err) {
          console.error(`Failed to fetch challenge ${id}:`, err);
          return { id, title: 'Error Loading Challenge' };
        }
      });

      const results = await Promise.all(fetchPromises);
      results.forEach(({ id, title }) => {
        details[id] = title;
      });

      setChallengeTitles(details);
    } catch (err) {
      console.error("Error fetching challenge details:", err);
    } finally {
      setLoadingChallenges(false);
    }
  };

  // Handle profile settings update
  const handleSaveSettings = async () => {
    if (!isOwnProfile) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const updatedData = {
        // Use null if displayName is empty/undefined
        display_name: displayName || null,
        ...settings
      };

      const sanitizedData = Object.fromEntries(
        Object.entries(updatedData).filter(([_, value]) => value !== undefined)
      );

      // Update user settings via API
      const response = await fetch(`/api/users/${slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sanitizedData)
      });

      if (response.ok) {
        setSaveMessage({ type: 'success', text: 'Saved successfully!' });
        // Update the local state with the new settings
        setUser(prev => ({ ...prev, ...sanitizedData }));
      } else {
        const errorData = await response.json();
        setSaveMessage({ type: 'error', text: errorData.error || 'Failed to save' });
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setSaveMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#222222] text-white p-8 flex justify-center items-center">
        <div className="text-2xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#222222] text-white p-8 flex justify-center items-center">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center mb-10 bg-gray-800 rounded-xl p-6">
          <div className="mb-4 md:mb-0 md:mr-6">
            {user.avatar && (
              <Image
                src={user.avatar}
                alt={user.display_name}
                width={120}
                height={120}
                className="rounded-full"
              />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              {isEditingName && isOwnProfile ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-3xl font-bold mb-2 bg-gray-700 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <h1 className="text-3xl font-bold mb-2">{user.display_name}</h1>
              )}

              {isOwnProfile && (
                isEditingName ? (
                  <button
                    onClick={() => { setIsEditingName(false); handleSaveSettings(); }}
                    className="ml-2 text-sm bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                    disabled={isSaving}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="ml-2 text-sm bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                  >
                    {isSaving ? 'Saving...' : 'Edit'}
                  </button>
                )
              )}
            </div>
            <p className="text-gray-400">@{user.username}</p>
            {user.points_accumulated !== undefined && (
              <p className="mt-2">
                <span className="font-semibold text-yellow-400">{user.points_accumulated}</span> points
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Stats (expands to full width when not viewing own profile) */}
          <div className={isOwnProfile ? "col-span-2" : "col-span-3"}>
            <div className="bg-gray-800 rounded-xl p-6 mb-6 flex flex-col min-h-[300px]">
              <h2 className="text-xl font-semibold mb-4">Challenge Stats</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                <div className="bg-gray-700 p-4 rounded-lg text-center flex flex-col justify-center">
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold">{user.accepted?.length || 0}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center flex flex-col justify-center">
                  <p className="text-gray-400 text-sm">Created</p>
                  <p className="text-2xl font-bold">{user.created?.length || 0}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center flex flex-col justify-center">
                  <p className="text-gray-400 text-sm">Attempted</p>
                  <p className="text-2xl font-bold">{user.attempted?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings (only shown if it's the user's own profile) */}
          {isOwnProfile && (
            <div className="col-span-1">
              <div className="bg-gray-800 rounded-xl p-6 min-h-[300px]">
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.points_are_public}
                        onChange={() => setSettings({ ...settings, points_are_public: !settings.points_are_public })}
                        className="mr-2"
                      />
                      <span>Show points publicly</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.accepted_are_public}
                        onChange={() => setSettings({ ...settings, accepted_are_public: !settings.accepted_are_public })}
                        className="mr-2"
                      />
                      <span>Show completed challenges publicly</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.ownership_is_public}
                        onChange={() => setSettings({ ...settings, ownership_is_public: !settings.ownership_is_public })}
                        className="mr-2"
                      />
                      <span>Show created challenges publicly</span>
                    </label>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className={`mt-4 w-full py-2 rounded-lg font-medium ${isSaving
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>

                  {saveMessage && (
                    <div className={`mt-2 p-2 rounded text-center ${saveMessage.type === 'success' ? 'bg-green-800' : 'bg-red-800'
                      }`}>
                      {saveMessage.text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Row: Challenge Lists - Now stacked vertically */}
        <div className="mt-6">
          {/* Created Challenges - Now first/on top */}
          {user.created && user.created.length > 0 && (
            <div className="mb-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Created Challenges</h2>
                {loadingChallenges ? (
                  <p className="text-gray-400">Loading challenge details...</p>
                ) : (
                  <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                    {user.created.map((challengeId, index) => (
                      <li key={index} className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                        <Link href={`/challenge/${challengeId}`} className="block w-full text-blue-400 hover:text-blue-300">
                          {challengeDetails[challengeId] || challengeId}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Completed Challenges - Now second/below */}
          {user.accepted && user.accepted.length > 0 && (
            <div>
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Completed Challenges</h2>
                {loadingChallenges ? (
                  <p className="text-gray-400">Loading challenge details...</p>
                ) : (
                  <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                    {user.accepted.map((challengeId, index) => (
                      <li key={index} className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                        <Link href={`/challenge/${challengeId}`} className="block w-full text-blue-400 hover:text-blue-300">
                          {challengeDetails[challengeId] || challengeId}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Message when no challenges to display */}
          {(!user.accepted || user.accepted.length === 0) &&
            (!user.created || user.created.length === 0) && (
              <div className="text-center py-10 bg-gray-800 rounded-xl">
                <p className="text-gray-400">No challenges to display.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
