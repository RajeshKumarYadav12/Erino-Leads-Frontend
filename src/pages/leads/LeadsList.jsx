import { React, useEffect, useMemo, useState, useRef } from "react";
import { leadsApi } from "../../api/api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Separate React component for Actions
const ActionCell = ({ data, onEdit, onDelete }) => (
  <div className="flex gap-2 justify-center">
    <button
      className="px-2 py-1 bg-sky-600 text-white rounded text-sm hover:bg-sky-700"
      onClick={() => onEdit(data._id)}
    >
      Edit
    </button>
    <button
      className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      onClick={() => onDelete(data._id)}
    >
      Delete
    </button>
  </div>
);

export default function LeadsList() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const gridRef = useRef();
  const nav = useNavigate();
  const { logout } = useAuth();

  // Fetch leads from API
  const fetchPage = async (p = page, l = limit, f = filters) => {
    try {
      const params = { page: p, limit: l, ...f };
      const res = await leadsApi.list(params);
      setRows(res.data);
      setPage(res.page);
      setLimit(res.limit);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) logout();
      else alert(err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const handleEdit = (id) => nav(`/leads/${id}/edit`);
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this lead?"))
      return;
    await leadsApi.remove(id);
    // Refresh page after deletion
    const remaining = rows.length - 1;
    const newPage = remaining === 0 && page > 1 ? page - 1 : page;
    fetchPage(newPage);
  };

  const columns = useMemo(
    () => [
      {
        headerName: "Name",
        valueGetter: (p) => `${p.data.first_name} ${p.data.last_name}`,
        minWidth: 150,
      },
      { field: "email", minWidth: 180 },
      { field: "phone", minWidth: 130 },
      { field: "company", minWidth: 150 },
      { field: "city", minWidth: 120 },
      { field: "state", minWidth: 120 },
      { field: "source", minWidth: 130 },
      { field: "status", minWidth: 120 },
      { field: "score", minWidth: 100 },
      { field: "lead_value", headerName: "Value", minWidth: 120 },
      {
        headerName: "Actions",
        pinned: "right",
        minWidth: 180,
        cellRenderer: (params) => (
          <ActionCell
            data={params.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ),
      },
    ],
    []
  );

  return (
    <div className="container mx-auto mt-6">
      <div className="flex items-center mb-3 gap-4">
        <h1 className="text-4xl font-semibold text-gray-800">All Leads</h1>
        <button
          onClick={() => nav("/leads/create")}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Create New Leads
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4 p-4 bg-gray-50 rounded-lg shadow flex flex-wrap gap-3">
        <input
          placeholder="Email contains"
          className="p-2 border rounded"
          onChange={(e) =>
            setFilters({ ...filters, email_contains: e.target.value })
          }
        />
        <input
          placeholder="Company Name"
          className="p-2 border rounded"
          onChange={(e) =>
            setFilters({ ...filters, company_contains: e.target.value })
          }
        />
        <select
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="p-2 border rounded bg-white"
        >
          <option value="">Any status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
          <option value="won">Won</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          className="p-2 border rounded bg-white"
        >
          <option value="">Any source</option>
          <option value="website">Website</option>
          <option value="facebook_ads">Facebook Ads</option>
          <option value="google_ads">Google Ads</option>
          <option value="referral">Referral</option>
          <option value="events">Events</option>
          <option value="other">Other</option>
        </select>
        <input
          type="number"
          placeholder="Score >"
          className="p-2 border rounded w-28"
          onChange={(e) => setFilters({ ...filters, score_gt: e.target.value })}
        />
        <button
          onClick={() => fetchPage(1)}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setFilters({});
            fetchPage(1);
          }}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>

      {/* AG Grid */}
      <div
        className="ag-theme-alpine rounded-lg shadow"
        style={{ height: 520, width: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rows}
          columnDefs={columns}
          defaultColDef={{
            flex: 1,
            minWidth: 120,
            filter: true,
            sortable: true,
            resizable: true,
          }}
          rowHeight={50}
          animateRows={true}
          pagination={false} // Keep false because we will use custom pagination
        />
      </div>

      {/* Manual Pagination */}
      <div className="flex items-center justify-between mt-3">
        <div>Total Leads: {total}</div>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => fetchPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <div>Page {page}</div>
          <button
            disabled={page * limit >= total}
            onClick={() => fetchPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              fetchPage(1, Number(e.target.value));
            }}
            className="p-1 border rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
