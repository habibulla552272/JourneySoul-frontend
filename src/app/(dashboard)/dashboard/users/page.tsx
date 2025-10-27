"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Ban, CheckCircle } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  joinDate: string
  status: "active" | "suspended"
  role: "user" | "admin"
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", joinDate: "2024-01-15", status: "active", role: "user" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", joinDate: "2024-02-20", status: "active", role: "admin" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", joinDate: "2024-03-10", status: "suspended", role: "user" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", joinDate: "2024-01-05", status: "active", role: "user" },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "" })

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email })
    setShowModal(true)
  }

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)))
    }
    setShowModal(false)
    setEditingUser(null)
  }

  const handleSuspend = (id: number) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u)))
  }

  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const handleCreateNew = () => {
    setEditingUser(null)
    setFormData({ name: "", email: "" })
    setShowModal(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">Create, update, and manage user accounts</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
          + New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Total: {users.length} users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Join Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-sm">{user.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4 text-sm">{user.joinDate}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-2 py-1 bg-slate-200 rounded text-xs font-medium capitalize">{user.role}</span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 hover:bg-blue-100 rounded transition"
                          title="Edit"
                        >
                          <Edit2 size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleSuspend(user.id)}
                          className="p-2 hover:bg-yellow-100 rounded transition"
                          title={user.status === "active" ? "Suspend" : "Activate"}
                        >
                          {user.status === "active" ? (
                            <Ban size={16} className="text-yellow-600" />
                          ) : (
                            <CheckCircle size={16} className="text-green-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-red-100 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingUser ? "Edit User" : "Create New User"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Save
                  </Button>
                  <Button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-300 hover:bg-slate-400 text-black"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
