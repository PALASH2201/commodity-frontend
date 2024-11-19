import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  addCommodity,
  deleteCommodity,
  getAllCommodities,
  updateCommodity,
} from "../lib/api-config";

export default function CommodityManagement() {
  const [commodities, setCommodities] = useState([]);
  const [newCommodity, setNewCommodity] = useState({
    name: "",
    unitPrice: "",
    quantity: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editCommodity, setEditCommodity] = useState({
    name: "",
    unitPrice: "",
    quantity: "",
    category: "",
  });

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const response = await getAllCommodities();
        if (response.status === 200) {
          setCommodities(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCommodities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommodity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !newCommodity.name ||
      newCommodity.unitPrice <= 0 ||
      newCommodity.quantity <= 0
    ) {
      alert("Incomplete Fields!");
      return;
    }
    try {
      const response = await addCommodity(newCommodity);
      if (response.status === 200 || response.status === 201) {
        setCommodities((prev) => [...prev, response.data]);
        setNewCommodity({
          name: "",
          unitPrice: "",
          quantity: "",
          category: "",
        });
      } else {
        throw new Error("Failed to add commodity");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCommodity(id);
      if (response.status === 200) {
        setCommodities((prev) =>
          prev.filter((commodity) => commodity.id !== id)
        );
      } else {
        throw new Error("Failed to delete commodity");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (commodity) => {
    setEditingId(commodity.id);
    setEditCommodity(commodity);
  };

  const handleUpdate = async () => {
    try {
      const response = await updateCommodity(editingId, editCommodity);
      if (response.status === 201) {
        setCommodities((prev) =>
          prev.map((commodity) =>
            commodity.id === editingId ? response.data : commodity
          )
        );
        setEditingId(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Commodity Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="mb-8 p-4 bg-gray-100 rounded-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Add New Commodity</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                type="text"
                name="name"
                value={newCommodity.name}
                onChange={handleInputChange}
                placeholder="Commodity Name"
                className="w-full"
              />
              <Input
                type="text"
                name="category"
                value={newCommodity.category}
                onChange={handleInputChange}
                placeholder="Category"
                className="w-full"
              />
              <Input
                type="number"
                name="unitPrice"
                value={newCommodity.unitPrice}
                onChange={handleInputChange}
                placeholder="Unit Price"
                min="0"
                step="0.01"
                className="w-full"
              />
              <Input
                type="number"
                name="quantity"
                value={newCommodity.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                min="0"
                className="w-full"
              />
            </div>
            <Button type="submit" className="mt-4">
              Add Commodity
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Commodity List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commodities.map((commodity) => (
                  <TableRow key={commodity.id}>
                    <TableCell>
                      {editingId === commodity.id ? (
                        <Input
                          type="text"
                          value={editCommodity.name}
                          onChange={(e) =>
                            setEditCommodity({
                              ...editCommodity,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        commodity.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === commodity.id ? (
                        <Input
                          type="text"
                          value={editCommodity.category}
                          onChange={(e) =>
                            setEditCommodity({
                              ...editCommodity,
                              category: e.target.value,
                            })
                          }
                        />
                      ) : (
                        commodity.category
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === commodity.id ? (
                        <Input
                          type="number"
                          value={editCommodity.unitPrice}
                          onChange={(e) =>
                            setEditCommodity({
                              ...editCommodity,
                              unitPrice: e.target.value,
                            })
                          }
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        `$${parseFloat(commodity.unitPrice).toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === commodity.id ? (
                        <Input
                          type="number"
                          value={editCommodity.quantity}
                          onChange={(e) =>
                            setEditCommodity({
                              ...editCommodity,
                              quantity: e.target.value,
                            })
                          }
                          min="0"
                        />
                      ) : (
                        commodity.quantity
                      )}
                    </TableCell>
                    <TableCell>
                      $
                      {(
                        parseFloat(commodity.unitPrice) *
                        parseFloat(commodity.quantity)
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {editingId === commodity.id ? (
                        <Button onClick={handleUpdate}>Save</Button>
                      ) : (
                        <Button onClick={() => handleEdit(commodity)}>
                          Edit
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDelete(commodity.id)}
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {commodities.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No commodities added yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
