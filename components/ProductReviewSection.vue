<template>
  <div class="product-reviews mt-5">
    <h4 class="mb-2">Customer Reviews</h4>
    <div v-if="(product.review_count ?? 0) > 0" class="mb-2">
      <span class="fs-5 fw-bold">{{
        product.average_rating?.toFixed(1) || "0.0"
      }}</span>
      <span class="text-warning ms-1">
        <ProductStarIcon
          v-for="i in 5"
          :key="i"
          :filled="i <= Math.round(product.average_rating || 0)"
        />
      </span>
      <span class="text-muted ms-2"
        >({{ product.review_count ?? 0 }} reviews)</span
      >
    </div>
    <div v-else class="text-muted mb-2">No reviews yet.</div>

    <!-- Latest 3 Reviews -->
    <div v-if="product.latest_reviews && product.latest_reviews.length">
      <div
        v-for="review in product.latest_reviews.slice(0, 3)"
        :key="review.id"
        class="review-card mb-3 p-3 border rounded position-relative"
      >
        <!-- Review header: badge, menu -->
        <div class="d-flex align-items-center review-header p-3" >
          <span
            :class="[
              'badge',
              'bg-success',
              'fs-6',
              'd-flex',
              'align-items-center',
            ]"
            style="margin-bottom: 0"
          >
            <LucideIcon icon="mdi:star" color="white" />
            <span class="fw-bold ms-1">{{ review.rating }}</span>
          </span>
          <div class="review-menu ms-auto" style="margin-top: -2.2rem;">
            <template v-if="user && review.user?.id === user.id">
              <div class="dropdown text-end">
                <button
                  class="btn btn-link p-0 text-dark"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style="font-size: 1.5rem"
                >
                  <LucideIcon
                    icon="mdi:dots-vertical"
                    style="vertical-align: middle; margin-top: 10px"
                  />
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                  <li>
                    <a
                      class="dropdown-item"
                      href="#"
                      @click.prevent="startEditReview(review)"
                      >Edit</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item text-danger"
                      href="#"
                      @click.prevent="deleteReview(review)"
                      >Delete</a
                    >
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </div>
        <div class="review-comment mb-1 fs-6">{{ review.comment }}</div>
        <div class="user-info-row d-flex align-items-center mt-2">
          <span class="fw-bold me-2 user-name">{{
            review.user?.name || "Anonymous"
          }}</span>
          <LucideIcon icon="mdi:verified" class="ms-1" />
        </div>
        <div class="text-muted small mt-1">
          {{ new Date(review.created_at).toLocaleString() }}
        </div>
        <!-- Admin reply -->
        <div
          v-if="review.reply"
          class="admin-reply bg-light p-2 rounded small mt-2"
        >
          <span class="fw-bold text-success">Admin reply:</span>
          <span>{{ review.reply }}</span>
          <span v-if="review.replied_by" class="text-muted ms-2"
            >- {{ review.replied_by?.name }}</span
          >
          <div v-if="isAdmin" class="mt-1">
            <button
              class="btn btn-link p-0 me-2"
              @click="startEditReply(review)"
            >
              Edit Reply
            </button>
            <button
              class="btn btn-link text-danger p-0"
              @click="deleteReply(review)"
            >
              Delete Reply
            </button>
          </div>
        </div>
        <div v-else-if="isAdmin" class="admin-reply-form mt-2">
          <form @submit.prevent="submitReply(review)">
            <input
              v-model="replyInputs[review.id]"
              class="form-control form-control-sm mb-1"
              placeholder="Write admin reply..."
            />
            <button class="btn btn-sm btn-success" type="submit">Reply</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Review Form -->
    <div v-if="user" class="review-form mt-4">
      <h5 v-if="!editingReview">Add Your Review</h5>
      <h5 v-else>Edit Your Review</h5>
      <form @submit.prevent="submitReview">
        <div class="mb-2">
          <label class="form-label me-2" style="vertical-align: middle;">Rating:</label>
          <span>
            <ProductStarIcon
              v-for="i in 5"
              :key="i"
              :filled="i <= reviewForm.rating"
              @click="reviewForm.rating = i"
              style="cursor: pointer; "
            />
          </span>
        </div>
        <div class="mb-2">
          <label class="form-label">Comment:</label>
          <textarea
            v-model="reviewForm.comment"
            class="form-control"
            rows="2"
            required
          ></textarea>
        </div>
        <button class="btn btn-smooth-success mb-5 mt-3" type="submit">
          {{ editingReview ? "Update Review" : "Submit Review" }}
        </button>
        <button
          v-if="editingReview"
          class="btn btn-link ms-2"
          type="button"
          @click="cancelEditReview"
        >
          Cancel
        </button>
      </form>
    </div>
    <div v-else class="text-muted mt-4">Please log in to write a review.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ProductStarIcon from "@/components/ProductStarIcon.vue";
import LucideIcon from "@/components/LucideIcon.vue";
import type { Product, User, Review } from "@/types";

const props = defineProps<{
  product: Product;
  user: User | null;
  isAdmin: boolean;
}>();

const emit = defineEmits(["refresh"]);

const reviewForm = ref({ rating: 0, comment: "" });
const editingReview = ref(false);
const editingReviewId = ref<number | null>(null);
const replyInputs = ref<Record<number, string>>({});
const editingReplyId = ref<number | null>(null);

function startEditReview(review: Review) {
  reviewForm.value.rating = review.rating;
  reviewForm.value.comment = review.comment;
  editingReview.value = true;
  editingReviewId.value = review.id;
}
function cancelEditReview() {
  editingReview.value = false;
  editingReviewId.value = null;
  reviewForm.value = { rating: 0, comment: "" };
}
function startEditReply(review: Review) {
  replyInputs.value[review.id] = review.reply || "";
  editingReplyId.value = review.id;
}

const API_BASE_URL = "http://ayurveda-marketplace.test/api";

async function submitReview() {
  if (!props.user || !props.product) return;
  const productSlug = props.product.slug;
  const token = localStorage.getItem("auth_token");
  try {
    if (!editingReview.value) {
      await $fetch(`${API_BASE_URL}/products/${productSlug}/reviews`, {
        method: "POST",
        body: {
          rating: reviewForm.value.rating,
          comment: reviewForm.value.comment,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await $fetch(
        `${API_BASE_URL}/products/${productSlug}/reviews/${editingReviewId.value}`,
        {
          method: "PUT",
          body: {
            rating: reviewForm.value.rating,
            comment: reviewForm.value.comment,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
    reviewForm.value = { rating: 0, comment: "" };
    editingReview.value = false;
    editingReviewId.value = null;
    emit("refresh");
  } catch (e: any) {
    alert(e?.data?.message || e?.message || "Failed to submit review.");
  }
}

async function deleteReview(review: Review) {
  if (!props.user || !props.product) return;
  const productSlug = props.product.slug;
  const token = localStorage.getItem("auth_token");
  try {
    await $fetch(
      `${API_BASE_URL}/products/${productSlug}/reviews/${review.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    emit("refresh");
  } catch (e: any) {
    alert(e?.data?.message || e?.message || "Failed to delete review.");
  }
}

async function submitReply(review: Review) {
  if (!props.user || !props.product) return;
  const productSlug = props.product.slug;
  const token = localStorage.getItem("auth_token");
  try {
    await $fetch(
      `${API_BASE_URL}/products/${productSlug}/reviews/${review.id}/reply`,
      {
        method: "POST",
        body: { reply: replyInputs.value[review.id] },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    replyInputs.value[review.id] = "";
    editingReplyId.value = null;
    emit("refresh");
  } catch (e: any) {
    alert(e?.data?.message || e?.message || "Failed to submit reply.");
  }
}

async function deleteReply(review: Review) {
  if (!props.user || !props.product) return;
  const productSlug = props.product.slug;
  const token = localStorage.getItem("auth_token");
  try {
    await $fetch(
      `${API_BASE_URL}/products/${productSlug}/reviews/${review.id}/reply`,
      {
        method: "POST",
        body: { reply: "" },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    replyInputs.value[review.id] = "";
    editingReplyId.value = null;
    emit("refresh");
  } catch (e: any) {
    alert(e?.data?.message || e?.message || "Failed to delete reply.");
  }
}
</script>

<style scoped>
.product-reviews {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2.5rem;
}
.review-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  transition: transform 0.2s;
}
.review-card:hover {
  transform: translateY(-2px);
}

</style>
