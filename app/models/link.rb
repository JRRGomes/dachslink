class Link < ApplicationRecord
  before_validation :generate_slug, on: :create

  validates :original_url, presence: true,
    format: { with: %r{\Ahttps?://}i, message: "must start with http:// or https://" }
  validates :slug, presence: true, uniqueness: true

  private

  def generate_slug
    return if slug.present?

    self.slug = loop do
      candidate = SecureRandom.alphanumeric(6)
      break candidate unless Link.exists?(slug: candidate)
    end
  end
end
