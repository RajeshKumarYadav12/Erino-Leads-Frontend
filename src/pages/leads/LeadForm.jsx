import React, { useEffect, useState } from "react";
import { leadsApi } from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

const defaultData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  company: "",
  city: "",
  state: "",
  source: "website",
  status: "new",
  score: 0,
  lead_value: 0,
  last_activity_at: "",
  is_qualified: false,
};

export default function LeadForm() {
  const { id } = useParams();
  const [data, setData] = useState(defaultData);
  const nav = useNavigate();

  useEffect(() => {
    if (id) {
      leadsApi
        .get(id)
        .then((res) => {
          // convert date to input-friendly
          setData({
            ...res,
            last_activity_at: res.last_activity_at
              ? new Date(res.last_activity_at).toISOString().slice(0, 16)
              : "",
          });
        })
        .catch(() => alert("Failed to fetch lead"));
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...data };
    if (payload.last_activity_at)
      payload.last_activity_at = new Date(payload.last_activity_at);
    try {
      if (id) await leadsApi.update(id, payload);
      else await leadsApi.create(payload);
      nav("/leads");
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mt-6">
      <div className="card mx-auto max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">
          {id ? "Edit Lead" : "Create Lead"}
        </h2>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="First name"
            value={data.first_name}
            onChange={(e) => setData({ ...data, first_name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            required
            placeholder="Last name"
            value={data.last_name}
            onChange={(e) => setData({ ...data, last_name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            required
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            required
            placeholder="Phone"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            placeholder="Company"
            value={data.company}
            onChange={(e) => setData({ ...data, company: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            placeholder="City"
            value={data.city}
            onChange={(e) => setData({ ...data, city: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            placeholder="State"
            value={data.state}
            onChange={(e) => setData({ ...data, state: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={data.source}
            onChange={(e) => setData({ ...data, source: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="website">website</option>
            <option value="facebook_ads">facebook_ads</option>
            <option value="google_ads">google_ads</option>
            <option value="referral">referral</option>
            <option value="events">events</option>
            <option value="other">other</option>
          </select>
          <select
            value={data.status}
            onChange={(e) => setData({ ...data, status: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="qualified">qualified</option>
            <option value="lost">lost</option>
            <option value="won">won</option>
          </select>
          <input
            type="number"
            min="1"
            max="100"
            placeholder="Score"
            value={data.score}
            onChange={(e) =>
              setData({ ...data, score: Number(e.target.value) })
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Lead value"
            value={data.lead_value}
            onChange={(e) =>
              setData({ ...data, lead_value: Number(e.target.value) })
            }
            className="p-2 border rounded"
          />
          <input
            type="datetime-local"
            value={data.last_activity_at}
            onChange={(e) =>
              setData({ ...data, last_activity_at: e.target.value })
            }
            className="p-2 border rounded col-span-2"
          />
          <label className="col-span-2">
            <input
              type="checkbox"
              checked={data.is_qualified}
              onChange={(e) =>
                setData({ ...data, is_qualified: e.target.checked })
              }
            />{" "}
            Is qualified
          </label>

          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="bg-sky-600 text-white px-4 py-2 rounded"
            >
              {id ? "Save" : "Create"}
            </button>
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded"
              onClick={() => nav("/leads")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
