class Link < ApplicationRecord
  before_validation :generate_slug, on: :create

  validates :original_url,
    presence: { message: "cole uma URL antes de encurtar" },
    format: { with: %r{\Ahttps?://}i,
              message: "a URL precisa começar com http:// ou https://",
              allow_blank: true }
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
