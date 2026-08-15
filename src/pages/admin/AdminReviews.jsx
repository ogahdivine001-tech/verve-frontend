import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { reviewService } from "../../services";
import { useToastStore } from "../../context/toastStore";
import RatingStars from "../../components/RatingStars";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import { ProductGridSkeleton } from "../../components/Loading";
import { formatDate } from "../../utils/format";

const statusVariant = { pending: "outline", approved: "teal", rejected: "error" };

export default function AdminReviews() {
  const [statusFilter, setStatusFilter] = useState("");
  const [deletingReview, setDeletingReview] = useState(null);
  const showToast = useToastStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews", statusFilter],
    queryFn: () => reviewService.getAll({ status: statusFilter, limit: 30 }),
  });

  const reviews = data?.data || [];

  const handleModerate = async (review, status) => {
    try {
      await reviewService.moderate(review._id, status);
      showToast(`Review ${status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    } catch (err) {
      showToast(err.message || "Could not update review", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await reviewService.remove(deletingReview._id);
      showToast("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setDeletingReview(null);
    } catch (err) {
      showToast(err.message || "Could not delete review", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl">Reviews</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-line px-3 py-2 text-sm outline-none bg-paper"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : reviews.length === 0 ? (
        <p className="text-sm text-ink-soft/60">No reviews found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div key={r._id} className="bg-paper border border-line p-4">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div>
                  <p className="text-sm font-medium">{r.product?.name}</p>
                  <p className="text-xs text-ink-soft/50">
                    {r.user?.firstName} {r.user?.lastName} · {formatDate(r.createdAt)}
                  </p>
                </div>
                <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
              </div>
              <RatingStars rating={r.rating} size={13} />
              <p className="text-sm text-ink-soft/80 mt-2">{r.comment}</p>
              <div className="flex items-center gap-3 mt-3">
                {r.status !== "approved" && (
                  <Button size="sm" variant="outline" onClick={() => handleModerate(r, "approved")}>Approve</Button>
                )}
                {r.status !== "rejected" && (
                  <Button size="sm" variant="outline" onClick={() => handleModerate(r, "rejected")}>Reject</Button>
                )}
                <button onClick={() => setDeletingReview(r)} aria-label="Delete review" className="ml-auto">
                  <Trash2 size={15} className="text-ink-soft/50 hover:text-error" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deletingReview}
        onClose={() => setDeletingReview(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review?"
        confirmLabel="Delete"
      />
    </div>
  );
}
